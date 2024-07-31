angular.module("filters", []).filter("searchFilter", () => {
  return (data, searchType, searchText) => {
    if (!searchText) {
      return data;
    }

    let keyword = RegExp(searchText, "i");
    return data.filter((item) => {
      switch (searchType) {
        case "name":
          return keyword.test(item.name);
        case "created_on":
          return keyword.test(item.created_on);
        case "mname":
          return keyword.test(item.model);
        case "brand":
          return keyword.test(item.brand);
      }
    });
  };
});