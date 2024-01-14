
class SerialManager {
    constructor(){
        this.decoder = new TextDecoderStream();
        this.encoder = new TextEncoderStream();
    }
    async connect(){
        try{
            this.port = await navigator.serial.requestPort();
        }catch(e){
            return false;
        }
        await (this.port).open({ baudRate: 9600 });   

        //((this.port).readable).pipeTo((this.decoder).writable);
        ((this.encoder).readable).pipeTo((this.port).writable);
        
        this.writer = ((this.encoder).writable).getWriter();
        //this.reader = ((this.decoder).readable).getReader();
        return true;
    }

    //Not used
    async readFrom(callback){
        
        while(true){
            const { value, done } = await (this.reader).read();
            if (value) {
                for(let i = 0; i < value.length; i++)
                {
                    console.log(value[i])
                    callback(i);
                }
            }
            if (done) {
                console.log('DONE', done);
                (this.reader).releaseLock();
                break;
            }
        }
    }

    writeTo(line){
        (this.writer).write(line);
        
    }
}

export default SerialManager;