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
                                md="3"
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
                                md="3"
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
                                md="3"
                            >
                                <v-select
                                    v-model="sexoSelected"
                                    :items="itemsSexo"
                                    item-value="value"
                                    item-text="descricao"
                                    label="Sexo"
                                ></v-select>
                            </v-col>
                            <v-col
                                cols="12"
                                md="3"
                            >
                                <v-select
                                    v-model="tipoDoadorSelected"
                                    :items="itemsTipoDoador"
                                    item-value="value"
                                    item-text="descricao"
                                    label="Tipo de Doador"
                                ></v-select>
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
        sexoSelected:{},
        tipoDoadorSelected: {},
        itemsSexo:[
            {
                descricao: 'Masculino',
                value: 'M'
            },
            {
                descricao: 'Feminino',
                value: 'F'
            }
        ],
        itemsTipoDoador:[
            {
                descricao: 'Ouro',
                value: 'O'
            },
            {
                descricao: 'Prata',
                value: 'P'
            },
            {
                descricao: 'Diamante',
                value: 'D'
            }
        ],
        pdfHeader:{},
        headersExcel:{
            'Numero do Agente':'NUMEROGENTE',
            'Nome':'NOME',
            'Contato':'FONE',
            'Celular':'CELULAR',
            'Sexo':'SEXO',
            'Quantidade':'QTDE_DOACOES',
            'Ultima Doação':'ULTIMA_DOACAO',
            'ABO/RH':'ABORHDOADOR'
        },
        headers: [
            {
                text: 'Numero do Agente',
                align: 'left',
                sortable: true,
                value: 'NUMEROGENTE',
            },
            {
                text: 'Nome',
                align: 'left',
                sortable: true,
                value: 'NOME',
            },
            {
                text: 'Contato',
                align: 'left',
                sortable: true,
                value: 'FONE',
            },
            {
                text: 'Celular',
                align: 'left',
                sortable: true,
                value: 'CELULAR',
            },
            {
                text: 'Sexo',
                align: 'left',
                sortable: true,
                value: 'SEXO',
            },
            {
                text: 'Quantidade',
                align: 'left',
                sortable: true,
                value: 'QTDE_DOACOES',
            },
            {
                text: 'Ultima Doação',
                align: 'left',
                sortable: true,
                value: 'ULTIMA_DOACAO',
            },
            {
                text: 'ABO/RH',
                align: 'left',
                sortable: true,
                value: 'ABORHDOADOR',
            }
        ],
        dataInicio: "",
        dataFim: "",
        codigoEmpresa: "",
        listEmpresas: [],
        resultData: [],
        empresaSelecionada: 0,
        loadingList: false
    }),
    methods:{
        pesquisar(){
            this.getAll();
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
            this.$http.get('/lista-doador-diamante-ouro-prata/',{
                params: {
                    dataInicio: this.castData(this.dataInicio),
                    dataFim: this.castData(this.dataFim),
                    sexo: this.sexoSelected,
                    tipoDoador: this.tipoDoadorSelected
                }
            }).then(res => {
                            this.resultData = res.data.result;
                            this.pdfHeader = res.data.header;
                            this.loadingList = false;
                        });
        },
        gerarRelatorio(){
            this.getAll();
        },
        generatePDF(){

            var resultData = Object.assign([],this.resultData.map((element)=>{
                return [
                    element.NUMEROGENTE,
                    element.NOME,
                    element.FONE,
                    element.CELULAR,
                    element.SEXO,
                    element.QTDE_DOACOES,
                    element.ULTIMA_DOACAO,
                    element.ABORHDOADOR
                ]
            })); 

            var customBody = [
                [
                    {text: 'Numero do Agente', style: 'tableHeader'}, 
                    {text: 'Nome', style: 'tableHeader'}, 
                    {text: 'Contato', style: 'tableHeader'},
                    {text: 'Celular', style: 'tableHeader'},
                    {text: 'Sexo', style: 'tableHeader'},
                    {text: 'Quantidade', style: 'tableHeader'},
                    {text: 'Ultima Doação', style: 'tableHeader'},
                    {text: 'ABO/RH', style: 'tableHeader'}
                ]
            ];

            for (let index = 0; index < resultData.length; index++) {
                const element = resultData[index];
                customBody.push(element);
            }

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
                                    {text: 'Usuario: ', fontSize: 10},
                                    {text: this.pdfHeader.usuario+' \n', fontSize: 10, bold: true},
                                    {text: 'Data Geração: ', fontSize: 10},
                                    {text: this.pdfHeader.dataAcessoConsulta+' \n', fontSize: 10, bold: true},
                                    {text: 'Período: ', fontSize: 10},
                                    {text: this.dataInicio+' - '+this.dataFim, fontSize: 10, bold: true}
                                ],
                                style: 'subheader'
                            }
                        ]

                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*', '*', '*', '*','*','*','*'],
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
                            }
                        }
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*', '*', '*', '*'],
                            headerRows: 1,
                            body: [
                                [
                                    {
                                        text: 'Total de Produtos',
                                        style: 'tableHeader'
                                    },
                                    {
                                        text: this.resultData.length
                                    },
                                ]
                            ]
                        }
                    }
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

            pdfMake.createPdf(docDefinition).download();
        }
    }

}
</script>

<style>

</style>