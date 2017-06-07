class DateHelper {

    constructor(){
        throw new Error('DateHelper não pode ser instanciado');
    }

    static dataParaTexto(data) {

        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }
    
    static textoParaData(texto) {

        if(/\d{4} -\d{2}\s{2}/.test(texto)){
            throw new Error('DEve ter no formato aaaa-mm-dd');
        }   

        return new Date(...texto.split('-').map((item, indice) => item - indice % 2));
    }

    

}