const axios = require('axios');
const MenuItem = require('../models/MenuItem');

const createMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      message: 'Menu item created successfully.',
      menuItem,
    });
  } catch (error) {
    next(error);
  }
};

const getMenuItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    next(error);
  }
};

const getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json({ menuItem });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    const allowedFields = [
      'name',
      'description',
      'price',
      'category',
      'image',
      'available',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        menuItem[field] = req.body[field];
      }
    });

    await menuItem.save();

    res.status(200).json({
      message: 'Menu item updated successfully.',
      menuItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getExternalCoffee = async (req, res, next) => {
  try {
    // Step 1: Get all drinks in the "Coffee / Tea" category
    const listResponse = await axios.get(
      'https://www.thecocktaildb.com/api/json/v1/1/filter.php',
      {
        params: { c: 'Coffee / Tea' },
        timeout: 10000,
      }
    );

    const drinkList = listResponse.data.drinks || [];

    // Step 2: Fetch full details for each drink in parallel
    const detailRequests = drinkList.map((drink) =>
      axios
        .get('https://www.thecocktaildb.com/api/json/v1/1/lookup.php', {
          params: { i: drink.idDrink },
          timeout: 10000,
        })
        .then((r) => r.data.drinks?.[0] || null)
        .catch(() => null)
    );

    const details = await Promise.all(detailRequests);

    // Step 3: Transform into a clean response
    const coffeeItems = details
      .filter((d) => d !== null)
      .map((d) => {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
          const ing = d[`strIngredient${i}`];
          const measure = d[`strMeasure${i}`];
          if (ing?.trim()) {
            ingredients.push({
              ingredient: ing.trim(),
              measure: measure ? measure.trim() : '',
            });
          }
        }

        return {
          id: d.idDrink,
          name: d.strDrink,
          instructions: d.strInstructions || '',
          category: d.strCategory || 'Coffee / Tea',
          glass: d.strGlass || '',
          image: d.strDrinkThumb || '',
          alcoholic: d.strAlcoholic || 'Non alcoholic',
          ingredients,
        };
      });

    res.status(200).json({
      source: 'https://www.thecocktaildb.com',
      count: coffeeItems.length,
      coffeeItems,
    });
  } catch (error) {
    res.status(502).json({
      message: 'Failed to fetch coffee data from TheCocktailDB.',
      error: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getExternalCoffee,
};
