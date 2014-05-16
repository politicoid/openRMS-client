function ItemCategory(id, text, parent)
{
	this.id = id;
	this.parent = parent;
	this.text = text;
};

ItemCategory.convertFormat = function(json_data, root)
{
	var list = [];
	var root = new ItemCategory('cat-0', 'All Items', '#');
	list.push(root);
	for (i = 0; i < json_data.length; i++)
	{
		var cat = json_data[i];
		var parent = 'cat-0';
		if (cat.parent != null)
			parent = 'cat-' + cat.parent;
		list.push(new ItemCategory('cat-' + cat.id, cat.name, parent));
	}
	return list;
};