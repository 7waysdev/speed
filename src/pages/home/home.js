import {BaseModule} from '../base/base'

export class Home extends BaseModule {

    init(){
        console.log('works ');
    }
}

let home = new Home('home');