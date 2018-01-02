var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "bamazon"
});



connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    //connection.end();
    readProducts();
  });
  orderItem();

//READ DATA FROM PRODUCTS TABLE
  function readProducts() {

    connection.query("SELECT item_id,product_name,price FROM products", function(err, res) {
      if (err) throw err;
      //console.log(res);
      console.log('Item_Id' + '   Product name' + '             Price');
      console.log('-------------------------------------------');
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + "       |  " + res[i].product_name + "              |  " + '$ ' + res[i].price);
      }
      connection.end();
    });
  }

//Function to ask the user the product and the quantity of the item they would like to buy

function orderItem() {
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the Product Id of the item you would like to purchase?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many units of this product you would like to purchase?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        
          console.log('OK');
        
      });
  }
