const faker = require("faker");
const fs = require("fs");
const { default: slugify } = require("slugify");
const slug = require('slugify')
faker.locale = "vi";

const randomCategoryList = (n) => {
  if (n <= 0) return [];
  const categoryList = [];
  Array.from(new Array(n).keys()).forEach((n) => {
    const category = {
      id: faker.random.uuid(),
      title: faker.commerce.department() + ' test',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    category.slug = slugify(category.title)
    categoryList.push(category);
  });
  return categoryList;
};

const randomProductList = (category, n) => {
  if (n <= 0) return [];
  const productList = [];

  for (let cate of category) {
    Array.from(new Array(n).keys()).forEach((n) => {
      const product = {
        id: faker.random.uuid(),
        title: faker.commerce.productName(),
        price: Number.parseFloat(faker.commerce.price(50, 4000)),
        description: faker.commerce.productDescription(),
        discount: faker.random.number({min: 10, max: 30}),
        thumbnail: faker.image.imageUrl(250, 250),
        categoryId: cate.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      productList.push(product);
    });
  }

  return productList;
};

(() => {
  // random data
  const categoryList = randomCategoryList(6);
  const productList = randomProductList(categoryList, 100);

  const db = {
    categories: categoryList,
    products: productList,
    profile: {
      name: "Evan Tran",
    },
  };

  fs.writeFile("db.json", JSON.stringify(db), () => {
    console.log("generate data successfully.");
  });
})();
