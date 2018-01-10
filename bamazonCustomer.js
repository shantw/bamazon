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
      orderItem();
      //return;
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
        // when finished prompting, check if the quantity of the item is greater than 0
        connection.query("SELECT stock_quantity FROM products where ?", 
        {
            item_id : answer.item
          }
        ,
        function(err, res) {
         if (err) throw err;
         //console.log(res[0].stock_quantity);
         //console.log(parseInt(answer.quantity));
          if (res[0].stock_quantity > parseInt(answer.quantity)){
            var newQuantity = res[0].stock_quantity - answer.quantity;
             updateStock(answer.item,newQuantity,answer.quantity);
          }
          else
          {
            console.log('Insufficient Quantity');
          }
         // connection.end();
  
        });
          //console.log('OK');
        
      });
  }


  function updateStock(itemId,quantity,quantity2) {
    
        connection.query("UPDATE products SET ? WHERE ?", 
        [
          {
            stock_quantity : quantity
          },
          {
            item_id : itemId
          }
        ],      
        
        function(err, res) {
          if (err) throw err;
          console.log('Updated!The new qunatity on hand is ' + quantity);
          calcTotal(itemId,quantity2);

        });
      }

      function calcTotal(itemId,q) {
        
            connection.query("SELECT * from products WHERE ?", 
              {
                item_id : itemId
              },      
            
            function(err, res) {
              if (err) throw err;
              var total = res[0].price * q;
              console.log('The price of this item is: '+ '$'+res[0].price);
              console.log('The total cost of your order is: ' + '$' + total);
              connection.end;
              
            });
          }