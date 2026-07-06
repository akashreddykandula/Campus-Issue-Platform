"""
utils/helpers.py  +  utils/validators.py  — merged for brevity
"""


def paginate_query(query, page: int, per_page: int) -> dict:
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items":    paginated.items,
        "total":    paginated.total,
        "pages":    paginated.pages,
        "page":     page,
        "per_page": per_page,
    }
