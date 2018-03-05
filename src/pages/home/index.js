import { BasePage } from '../base'
import { Product } from '../../modules/product'

export class HomePage extends BasePage {

    init(){
        
        let product = new Product();

        product.getProductById(3293970).then(function(res){

        })
    }
}

let home = new HomePage('home');