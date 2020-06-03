<template>
<v-content>
    <v-container fluid>
    <v-row>
        <v-col>
            <v-expansion-panels v-model="panel" multiple>
                <v-expansion-panel>
                <v-expansion-panel-header>Filtro</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-row>
                            <v-col
                                cols="12"
                                md="4"
                            >
                                <v-text-field
                                    label="Data Inicio"
                                    placeholder="Data Inicio"
                                    v-mask="'##/##/####'"
                                    v-model="dataInicio"
                                ></v-text-field>
                            </v-col>

                            <v-col
                                cols="12"
                                md="4"
                            >
                                <v-text-field
                                    label="Data Fim"
                                    placeholder="Data Fim"
                                    v-mask="'##/##/####'"
                                    v-model="dataFim"
                                ></v-text-field>
                            </v-col>

                            <v-col
                                cols="12"
                                md="4"
                            >
                                <v-autocomplete
                                    v-model="empresaSelecionada"
                                    :items="listEmpresas"
                                    :loading="isLoading"
                                    :search-input.sync="search"
                                    hide-no-data
                                    hide-selected
                                    item-text="descricaoempresa"
                                    item-value="codigoempresa"
                                    label="Empresas"
                                    placeholder="Nome da empresa"
                                    prepend-icon="mdi-database-search"
                                ></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row style="margin-left: 15px">
                            <v-col class="d-flex align-center justify-end">
                                    <v-btn color="blue darken-1" fab @click="pesquisar()" :loading="loadingList">
                                    <v-icon color='white'>mdi-magnify</v-icon>
                                </v-btn>      
                            </v-col>
                            
                        </v-row>
                    </v-row>
                </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table
                :headers="headers"
                :items="resultData"
                item-key="name"
                class="elevation-1"
                :loading="loadingList"
            >
                <template v-slot:top>
                    <v-row class="d-flex align-center justify-end">

                        <v-col class="d-flex align-center justify-end " style="margin-right: 15px">
                            <p class="subtitle-1 font-weight-bold mr-3" style="margin-bottom: 0px">
                                Exportar em 
                            </p>
                            <v-btn-toggle >
                                <v-btn color="red darken-1" fab x-small @click="generatePDF()" :disabled="resultData.length == 0"       :loading="loadingList">
                                    <v-icon color='white'>mdi-file-pdf-box</v-icon>
                                </v-btn>
                            </v-btn-toggle>
                            <download-excel
                                :data="dataExcel"
                                :title="[pdfHeader.titulo,'Data de Geração: '+pdfHeader.dataAcessoConsulta, 'Usuário: '+ pdfHeader.usuario, 'Empresa:'+getEmpresaDescription(), '']"
                                :name="pdfHeader.titulo + ' '+pdfHeader.dataAcessoConsulta"
                                :fields="headersExcel">
                                <v-btn-toggle >
                                    <v-btn color="green darken-1" x-small fab :disabled="resultData.length == 0" :loading="loadingList">
                                        <v-icon color='white'>mdi-microsoft-excel</v-icon>
                                    </v-btn>
                                </v-btn-toggle>
                            </download-excel>
                            
                            
                        </v-col>
                    </v-row>
                </template>
            </v-data-table>
           
        </v-col>
    </v-row>
    <div>
        <v-row>
            <v-col>
                
            </v-col>
        </v-row>     
    </div>
 </v-container>   
</v-content>
  
</template>

<script>

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export default {
    created: function(){
        this.getEmpresas();
        //this.getAll();
    },
    data: () => ({
        panel: [0],
        pdfHeader:{},
        summarizer:[],
        headersExcel:{
            'Data de Transfusão':'descricaoempresa',
            'Numero Bolsa':'numerobolsa',
            'Nome Produto':'nomeproduto',
            'Sequencial':'sequencialseparacao',
            'Tipo Componente':'tipocomponente',
            'Vencimento':'vencimento',
            'Paciente':'nomepaciente',
            'Tipo Paciente':'tipopaciente',
            'Lançamemto':'datalancamento',
        },
        headers: [
            {
                text: 'Data de Transfusão',
                align: 'left',
                sortable: true,
                value: 'datatransfusao',
            },
            {
                text: 'Numero Bolsa',
                align: 'left',
                sortable: true,
                value: 'numerobolsa',
            },
            {
                text: 'Nome Produto',
                align: 'left',
                sortable: true,
                value: 'nomeproduto',
            },
            {
                text: 'Sequencial',
                align: 'left',
                sortable: true,
                value: 'sequencialseparacao',
            },
            {
                text: 'Tipo Componente',
                align: 'left',
                sortable: true,
                value: 'tipocomponente',
            },
            {
                text: 'Vencimento',
                align: 'left',
                sortable: true,
                value: 'vencimento',
            },
            {
                text: 'Paciente',
                align: 'left',
                sortable: true,
                value: 'nomepaciente',
            },
            {
                text: 'Tipo Paciente',
                align: 'left',
                sortable: true,
                value: 'tipopaciente',
            },
            {
                text: 'Lançamemto',
                align: 'left',
                sortable: true,
                value: 'datalancamento',
            }
        ],
        dataInicio: "",
        dataFim: "",
        codigoEmpresa: "",
        listEmpresas:[],
        listEmpresasFiltered:[],
        resultData: [],
        empresaSelecionada: 0,
        loadingList: false,
        summarizer:[]
    }),
    watch:{
        /*search (val) {

            // Items have already been loaded
            if (this.listEmpresas.length > 0) return

            // Items have already been requested
            if (this.isLoading) return

            this.isLoading = true

            this.$http.get('/lista-empresa').then(res => {
                this.listEmpresas = res.data.filter((res)=>{
                    this.isLoading = false;
                    return res.descricaoempresa.search(val) != -1;
                });
            });
      },*/
    },
    methods:{
        isEnabled (slot) {
            return this.enabled === slot
        },
        pesquisar(){
            this.getAll();
        },
        getEmpresaDescription(){
            return this.listEmpresas.filter((element)=>{
                return element.codigoempresa == this.empresaSelecionada;
            })[0].descricaoempresa;
        },
        getEmpresas(){
            this.loadingList = true;
            this.$http.get('/lista-empresa').then(res => {
                this.listEmpresas = res.data;
                this.loadingList = false;
            });
        },
        castData(value){
            return value.substring(6,10)+"-"+value.substring(3,5)+"-"+value.substring(0,2)
        },
        getAll(){
            this.loadingList = true;
            this.$http.get('/produtos-transfusao/',{
                params: {
                    dataInicio: this.castData(this.dataInicio),
                    dataFim: this.castData(this.dataFim),
                    codigoEmpresa: this.empresaSelecionada
                }
            }).then(res => {
                            this.resultData = res.data.result;
                            this.pdfHeader = res.data.header;
                            this.summarizer = res.data.totalizador;
                            this.loadingList = false;
                        });
        },
        gerarRelatorio(){
            this.getAll();
        },
        generatePDF(){
            
            var resultData = Object.assign([],this.resultData.map((element)=>{
                return [
                    element.datatransfusao,
                    element.numerobolsa,
                    element.nomeproduto,
                    element.sequencialseparacao,
                    element.tipocomponente,
                    element.vencimento,
                    element.nomepaciente,
                    element.tipopaciente,
                    element.datalancamento
                ]
            }));

            var customBody = [
                [
                    {text: 'Data Transfusão', style: 'tableHeader'}, 
                    {text: 'Numero Bolsa', style: 'tableHeader'}, 
                    {text: 'Nome Produto', style: 'tableHeader'},
                    {text: 'Sequencial', style: 'tableHeader'},
                    {text: 'Tipo Componente', style: 'tableHeader'},
                    {text: 'Vencimentro', style: 'tableHeader'},
                    {text: 'Nome Paciente', style: 'tableHeader'},
                    {text: 'Tipo Paciente', style: 'tableHeader'},
                    {text: 'Data Lançamento', style: 'tableHeader'},
                ]
            ];

            for (let index = 0; index < resultData.length; index++) {
                const element = resultData[index];
                customBody.push(element);
            }

             var resultDataSummarizer = Object.assign([],this.summarizer.map((element)=>{
                return [
                    element.nomeproduto,
                    element.quantidade
                ]
            }));


            var customSummarizer = [
                [
                    {text: 'Nome de Produto', style: 'tableHeader'}, 
                    {text: 'Total de Produto', style: 'tableHeader'}, 

                ]
            ];

            for (let index = 0; index < resultDataSummarizer.length; index++) {
                const element = resultDataSummarizer[index];
                customSummarizer.push(element);
            }

            customSummarizer.push(
                [
                    {text: 'Total de Produtos', style: 'tableHeader'},
                    {text: this.resultData.length}
                ]
            );

            pdfMake.vfs = pdfFonts.pdfMake.vfs;

            var docDefinition = {
                pageOrientation: 'landscape',
                pageMargins: [ 20, 20, 20, 20 ],
                content: [
                    {
                        columns: [
                            {
                                image: 'data:image/png;base64,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',
                                width: 125,
                                height: 60,
                                style: 'img'
                            },
                            {
                                text: this.pdfHeader.titulo,
                                style: 'header'
                            },
                            {
                                text:[
                                    {text: 'Usuario :', fontSize: 10},
                                    {text: this.pdfHeader.usuario+' \n', fontSize: 10, bold: true},
                                    {text: 'Data Geração :', fontSize: 10},
                                    {text: this.pdfHeader.dataAcessoConsulta+' \n', fontSize: 10, bold: true},
                                    {text: 'Empresa: ', fontSize: 10},
                                    {text: this.getEmpresaDescription()+' \n', fontSize: 10, bold: true},  
                                    {text: 'Período :', fontSize: 10},
                                    {text: this.dataInicio+' - '+this.dataFim, fontSize: 10, bold: true}
                                ],
                                style: 'subheader'
                            }
                        ]

                    },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: customBody
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                            // paddingLeft: function(i, node) { return 4; },
                            // paddingRight: function(i, node) { return 4; },
                            // paddingTop: function(i, node) { return 2; },
                            // paddingBottom: function(i, node) { return 2; },
                            // fillColor: function (rowIndex, node, columnIndex) { return null; }
                        }
                    },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: customSummarizer
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                            // paddingLeft: function(i, node) { return 4; },
                            // paddingRight: function(i, node) { return 4; },
                            // paddingTop: function(i, node) { return 2; },
                            // paddingBottom: function(i, node) { return 2; },
                            // fillColor: function (rowIndex, node, columnIndex) { return null; }
                        }
                    },
                ],
                styles: {
                    img:{
                       margin: [10, 10, 10, 10]
                    },
                    header: {
                        fontSize: 16,
                        alignment: 'center',
                        bold: true,
                        margin: [40, 30, 0, 0]
                    },
                    subheader: {
                        margin: [40, 20, 0, 0],
                        alignment: 'right',
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // alignment: 'justify'
                }
                
            };

            var now = new Date();

            pdfMake.createPdf(docDefinition).download(this.pdfHeader.titulo+' '+this.pdfHeader.dataAcessoConsulta);
        }
    },
    computed:{
        dataExcel(){
            var resultArrayExcel = Object.assign([],this.resultData);
            for (let index = 0; index < this.summarizer.length; index++) {
                if(index == 0){
                    resultArrayExcel.push({});
                    resultArrayExcel.push({
                        'descricaoempresa': 'Quantidade de Produtos',
                        'numerobolsa': 'Nome do Produto'
                    });
                }

                var customDataTotalLine = {};

                const dataTotalExcel = this.summarizer[index];

                var dataHEaderExcelKeyArray = Object.keys(this.headersExcel);
                for (let indexDataHEaderExcelKeyArray = 0; 
                    (indexDataHEaderExcelKeyArray < dataHEaderExcelKeyArray.length && 
                     indexDataHEaderExcelKeyArray < Object.keys(this.summarizer[index]).length);
                     indexDataHEaderExcelKeyArray++) 
                {

                    customDataTotalLine[this.headersExcel[dataHEaderExcelKeyArray[indexDataHEaderExcelKeyArray]]] 
                    = this.summarizer[index][Object.keys(this.summarizer[index])[indexDataHEaderExcelKeyArray]];
                }

                resultArrayExcel.push(customDataTotalLine);
            }
            return resultArrayExcel;
        }
    }

}
</script>

<style>

</style>