class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputQuantidade = $('#quantidade');
        this._inputData = $('#data');
        this._inputValor = $('#valor');
        this._ordemAtual = '';

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto');

        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(negociacoes => {

                negociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao))
            })
            .catch(error => {
                console.log(error);
                this._mensagem.texto = error;
            })
    }


    adiciona(event) {

        event.preventDefault();

        ConnectionFactory
            .getConnection()
            .then(connection => {

                let negociacao = this._criaNegociacao();

                new NegociacaoDao(connection)
                    .adiciona(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = 'Negociação adicionada com sucesso';
                        this._limpaFormulario();
                    })

            })
            .catch(erro => this._mensagem.texto = erro);

    }

    importaNegociacoes() {

        let service = new NegociacaoService();
        service
            .obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negocicao =>
                    !this._listaNegociacoes.negociacoes.some(negociacaoExistente =>
                        JSON.stringify(negocicao) == JSON.stringify(negociacaoExistente)))
            )
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas'
            }))
            .catch(erro => this._mensagem.texto = erro);


        // Promise.all([
        //     service.obterNegociacoesDaSemana(),
        //     service.obterNegociacoesDaSemanaAnterior(),
        //     service.obterNegociacoesDaSemanaRetrasada()]
        // ).then(negociacoes => {
        //     negociacoes
        //         .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
        //         .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));

        //     this._mensagem.texto = 'Negociações importadas com sucesso';
        // })
        //     .catch(error => this._mensagem.texto = error);

    }

    apaga() {

        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            });
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value),
        );
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;

        this._inpu
    }

    ordena(coluna) {
        if (this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes._negociacoes.sort((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

}