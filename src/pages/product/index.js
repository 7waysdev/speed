import { BasePage } from '../base';

class ProductPage extends BasePage {

    /*
     * Init()
     * Called automatically when instanced
     */
    init(){
        console.log('works ');
    }

}

let product = new ProductPage('product');