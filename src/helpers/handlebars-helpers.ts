const handlebarsHelpers: any = {
	ternary: function (cond: any, v1: any, v2: any) {
		return cond ? v1 : v2;
	},
	ifnot: function (cond: any, v1: any) {
		if (!cond) return v1;
	},
	plusOne: function (value: any) {
		return value + 1;
	},
	switch: function (value: any, options: any) {
		this.switch_value = value;
		return options.fn(this);
	},
	case: function (value: any, options: any) {
		if (value == this.switch_value) {
			return options.fn(this);
		}
	},
};

export default handlebarsHelpers;
