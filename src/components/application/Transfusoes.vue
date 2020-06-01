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
                                :data="resultData"
                                :name="pdfHeader.titulo + ' '+pdfHeader.dataAcessoConsulta"
                                :fields="resultData">
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
        loadingList: false
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
    }

}
</script>

<style>

</style>