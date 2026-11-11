from titicaca_pipeline.boundaries import validate_basin_ids

def test_validate_exact_four_basins():
    valid = ["ramis", "coata", "ilave", "huancane"]
    assert validate_basin_ids(valid) is True

def test_reject_incomplete_basins():
    incomplete = ["ramis", "coata", "ilave"]
    assert validate_basin_ids(incomplete) is False

def test_reject_unknown_basins():
    unknown = ["ramis", "coata", "ilave", "otro"]
    assert validate_basin_ids(unknown) is False
