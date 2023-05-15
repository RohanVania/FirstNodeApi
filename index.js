// We use Node Js as it gives power to handle many stuff that browser cannot give for example
// networking, working with files, working with OS threads etc

// Port Number on Which Server will Run
const portnumber = 4000;

// Importing http module for creating server and handling about http operations
const http = require("http");

// Importing File module for doing all operations related to file
const fs = require("fs");

// Import Url module to work with urls, eg parsing url for query string etc.
const url = require("url");

// Replace Function
// As we are replacing our html content with Json data Dynamically.
const replacetemplate = require("./modules/replaceTemplate");

// Reading our Html File and storing it in variable
// We are doing this Syncronously as, it will be only done once. During Every Reload and not on every request
let overview = fs.readFileSync("./templates/overview.html", "utf-8");

const productfile = fs.readFileSync(
    "./templates/template-product_card.html",
    "utf-8"
);

const detailproductfile = fs.readFileSync("./templates/product.html", "utf-8");

// Reading our Json Data
const jsondata = fs.readFileSync("./dev-data/data.json", "utf-8");

// Converting Json Data in Javascript Object for easy working or manipulation
let data = JSON.parse(jsondata);

// Creating http server and storing it in server and then running that server on given port
// Note : In express we dont do this, its automatically done when we create instance of express.

const server = http.createServer((req, res) => {
    // Reading our url as we want to parse it using url module
    const path = req.url;
    console.log(path);

    // Parsing our url and Destructing pathname and query
    // Second Parameter True is Important and it will have query object
    let { pathname, query } = url.parse(path, true);
    console.log(pathname, query)
    // Rest Architecture is not followed
    if (pathname === "/" || pathname === "/overview") {
        // Writing Response Header
        res.writeHead(200, { "Content-type": "text/html" });

        // Mapping each Json data product and Replacing it with each product details.
        // We get arrayof html as eg["<h1>Rohan</h1>","h2>Vania</h2>"]
        // Using join we convert the array into string
        //Eg "<h1>Rohan</h1><h2>Vania</h2>"
        const map = data
            .map((el) => {
                return replacetemplate(el, productfile);
            })
            .join("");

        // And Then Replacing
        const mainoutput = overview.replace("[%PRODUCT_DETAILS%]", map);
        // Then Response in the output.
        res.end(mainoutput);
    } else if (pathname == "/products") {
        res.writeHead(200, { "Content-type": "text/html" });

        const dataproduct = data[query.id];
        const output_product = replacetemplate(dataproduct, detailproductfile);
        res.end(output_product);
    } else {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end("<h1>Sorry Page Not Found!</h1>");
    }
});

// Running Server at Given Port Number
server.listen(portnumber, () => {
    console.log(`Server Listening At ${portnumber}`);
});
