/*
class SerialManager {
    constructor(){

    }

    async connect(){
        port.current = await navigator.serial.requestPort();
        await (port.current).open({ baudRate: 9600 });
        setConnected(true);
        updateButtonDisabled(Array(buttonNames.length).fill(false));

        
        const decoder = new TextDecoderStream();
        ((port.current).readable).pipeTo(decoder.writable);
        reader.current = (decoder.readable).getReader();
        

        const encoder = new TextEncoderStream();
        (encoder.readable).pipeTo((port.current).writable);
        writer.current  = (encoder.writable).getWriter();

        //readFrom();
        
        let port;
        try{
        port = await navigator.serial.requestPort();
        } catch (e){
        return; //No port specified
        }
        setConnected("CONNECTING...")
        try{
        await (port).open({ baudRate: 9600 });
        }catch (e){
        //
        }

        setConnected("CONNECTED");
        setButtonDisabled(Array(buttonNames.length).fill(false));
        
    }

    async readFrom(){
    
        while(true){
            const { value, done } = await (reader.current).read();
            if (value) {
                for(let i = 0; i < value.length; i++){
                toggleButton(parseInt(value[i]), false);
                }
            }
            if (done) {
                console.log('DONE', done);
                (reader.current).releaseLock();
                break;
            }
        }
    }

    async writeTo(line){
    
        (writer.current).write(line);
        
        (writer.current).releaseLock();
    }
}

export default SerialManager;*/