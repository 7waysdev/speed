import {BasePage} from '../base-page/base-page'

export class HomePage extends BasePage {

    init(){
        console.log('works ');
    }
}

let home = new HomePage('home');