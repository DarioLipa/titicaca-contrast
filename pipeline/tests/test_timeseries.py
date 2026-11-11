def is_complete_year(month_count: int) -> bool:
    return month_count == 12

def test_complete_year():
    assert is_complete_year(12) is True

def test_incomplete_year():
    assert is_complete_year(11) is False
    assert is_complete_year(0) is False

