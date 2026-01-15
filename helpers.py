class StrictDict(dict):
    def __init__(self, *args, type_map: dict | None=None, **kwargs):
        # Let dict do its normal initialization
        super().__init__(*args, **kwargs)

        # Now run your custom checks
        self.type_map = type_map
        if isinstance(self.type_map, dict):
            for key, value in self.items():
                if key not in self.type_map.keys():
                    raise ValueError("invalid data for StrictDict")
                if isinstance(value, dict):
                    value = StrictDict(value, type_map=self.type_map[key])
                    continue
                if not isinstance(value, self.type_map[key]):
                    raise TypeError("invalid data for StrictDict")