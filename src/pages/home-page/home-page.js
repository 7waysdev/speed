import { BasePage } from '../base-page/base-page'
import { Product } from '../../modules'

export class HomePage extends BasePage {

    init(){
        console.log('works ');

        let product = new Product();

        product.getProductById(3293970).then(function(res){

        })
    }
}

let home = new HomePage('home');