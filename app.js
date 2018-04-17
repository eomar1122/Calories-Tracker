//==================================
// Storage Controller
//==================================




//==================================
// Item Controller
//==================================

const ItemCtrl = (function() {
  // console.log('Item Controller');

  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State   similar to React state
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 400},
      // {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // This data is private data and to make it accessible, we have to do return 
  // Public methods
  return {
    getItems: function() {
      return data.items;
    },

    addItem: function(name, calories) {
      let ID;
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to numbers
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    getTotalCalories: function() {
      let total = 0;

      // Loop throgh items and add calories
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = total;

      // Return data.totalCalories
      return data.totalCalories;
    },

    getItemById: function(id) {
      let found = null;

      // loop through items
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },

    logData: function() {
      return data;
    }
  }

})();


//==================================
// UI Controller
//==================================

const UICtrl = (function() {
  // console.log('UI Controller');

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public methods when returns
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HRML
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';

    },

    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();

    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function() {
      UICtrl.clearInput();
      // Hide update, delete, and back buttons and show add button
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';


    },

    showEditState: function() {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },

    getSelectors: function() {
      return UISelectors;
    }
  }
})();


//==================================
// App Controller
//==================================

const AppCtrl = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();
    // console.log(input);

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== '') {

      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem); 

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e) {

    if(e.target.classList.contains('edit-item')) {
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;
      
      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();

    }

    e.preventDefault();
  }

  // Public methods when returns
  return {
    init: function() {
      // Clear edit state / set edit state
      UICtrl.clearEditState();

      // Fetch items from data structure / ItemCtrl
      const items = ItemCtrl.getItems();
      // console.log(items);

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

// Initialize App
AppCtrl.init();
