"""
services/analytics_service.py
------------------------------
Aggregates complaint data using Pandas for the admin analytics dashboard.
All methods return plain dicts/lists suitable for JSON serialisation.
"""

import io
import csv
from datetime import datetime, timedelta
import pandas as pd
from app.models import Complaint, Student
from app.extensions import db


class AnalyticsService:

    @staticmethod
    def _get_dataframe() -> pd.DataFrame:
        complaints = Complaint.query.all()
        if not complaints:
            return pd.DataFrame()
        rows = [c.to_dict(include_student=True) for c in complaints]
        df = pd.DataFrame(rows)
        df["created_at"] = pd.to_datetime(df["created_at"])
        return df

    # ── Overview KPIs ─────────────────────────────────────────────────────────

    @staticmethod
    def get_overview() -> dict:
        total      = Complaint.query.count()
        pending    = Complaint.query.filter_by(status="Pending").count()
        resolved   = Complaint.query.filter_by(status="Resolved").count()
        critical   = Complaint.query.filter_by(priority_level="Critical").count()
        in_prog    = Complaint.query.filter_by(status="In Progress").count()
        escalated  = Complaint.query.filter_by(status="Escalated").count()
        students   = Student.query.count()
        return {
            "total":       total,
            "pending":     pending,
            "resolved":    resolved,
            "critical":    critical,
            "in_progress": in_prog,
            "escalated":   escalated,
            "students":    students,
            "resolution_rate": round((resolved / total * 100) if total else 0, 1),
        }

    # ── Monthly trend ─────────────────────────────────────────────────────────

    @staticmethod
    def get_monthly() -> list[dict]:
        df = AnalyticsService._get_dataframe()
        if df.empty:
            return []
        df["month"] = df["created_at"].dt.to_period("M").astype(str)
        grouped = df.groupby("month").size().reset_index(name="count")
        grouped = grouped.sort_values("month").tail(12)
        return grouped.to_dict("records")

    # ── Category breakdown ────────────────────────────────────────────────────

    @staticmethod
    def get_by_category() -> list[dict]:
        df = AnalyticsService._get_dataframe()
        if df.empty:
            return []
        grouped = df.groupby("category").size().reset_index(name="count")
        return grouped.sort_values("count", ascending=False).to_dict("records")

    # ── Priority distribution ─────────────────────────────────────────────────

    @staticmethod
    def get_priority_distribution() -> list[dict]:
        df = AnalyticsService._get_dataframe()
        if df.empty:
            return []
        grouped = df.groupby("priority_level").size().reset_index(name="count")
        return grouped.to_dict("records")

    # ── Top locations ─────────────────────────────────────────────────────────

    @staticmethod
    def get_top_locations(limit: int = 10) -> list[dict]:
        df = AnalyticsService._get_dataframe()
        if df.empty:
            return []
        df["loc"] = df["custom_location"].fillna(df["location"])
        grouped = df.groupby("loc").size().reset_index(name="count")
        return grouped.sort_values("count", ascending=False).head(limit).to_dict("records")

    # ── Resolution time ───────────────────────────────────────────────────────

    @staticmethod
    def get_resolution_time() -> dict:
        df = AnalyticsService._get_dataframe()
        if df.empty or "resolved_at" not in df.columns:
            return {"average_hours": 0, "by_priority": []}
        resolved = df[df["resolved_at"].notna()].copy()
        if resolved.empty:
            return {"average_hours": 0, "by_priority": []}
        resolved["resolved_at"] = pd.to_datetime(resolved["resolved_at"])
        resolved["hours"] = (resolved["resolved_at"] - resolved["created_at"]).dt.total_seconds() / 3600
        avg = round(resolved["hours"].mean(), 1)
        by_prio = resolved.groupby("priority_level")["hours"].mean().round(1).reset_index()
        by_prio.columns = ["priority_level", "avg_hours"]
        return {"average_hours": avg, "by_priority": by_prio.to_dict("records")}

    # ── Department wise ───────────────────────────────────────────────────────

    @staticmethod
    def get_by_department() -> list[dict]:
        df = AnalyticsService._get_dataframe()
        if df.empty or "student" not in df.columns:
            return []
        df["branch"] = df["student"].apply(lambda s: s.get("branch", "Unknown") if isinstance(s, dict) else "Unknown")
        grouped = df.groupby("branch").size().reset_index(name="count")
        return grouped.sort_values("count", ascending=False).to_dict("records")

    # ── CSV export ────────────────────────────────────────────────────────────

    @staticmethod
    def export_csv() -> str:
        complaints = Complaint.query.all()
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Title", "Category", "Location", "Priority", "Status", "Reporter Count", "Created At", "Resolved At"])
        for c in complaints:
            writer.writerow([
                c.id, c.title, c.category, c.full_location,
                c.priority_level, c.status, c.reporter_count,
                c.created_at.strftime("%Y-%m-%d %H:%M"),
                c.resolved_at.strftime("%Y-%m-%d %H:%M") if c.resolved_at else "",
            ])
        return output.getvalue()
