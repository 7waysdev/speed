export class BasePage {

    constructor(name){
        this.name = name;
        this.onLoad();
    }

    init() {
        throw new Error('You have to implement init()');
    }

    onLoad(){
        if(typeof this.name == 'undefined') return;

        if($('body').hasClass(this.name)){
            $( document ).ready( () => {
                this.init();
            });
        }
    }
}