<template>
  <v-content>
    <v-container
      fill-height
    >
    <v-layout
            align-center
            justify-space-between
          >
      <v-flex
        sm6
        md6
      >
        <v-img
          :src="require('../assets/MARCA_OFICIAL_03.png')"
          aspect-ratio="1.7" contain
        ></v-img>
      </v-flex>
      <v-flex
            xs12
            sm4
            md4
          >
          <v-alert
            :value="showAlert"
            dense
            outlined
            color="white"
            type="info"
            dismissible
            transition="scale-transition"
          >
            {{mensagemSucesso}}
          </v-alert>
<!-- 
  Dialog Esqueci Minha Senha
  ////////////////////////////////
-->
    <v-dialog
          v-model="dialogEsqueciMinhaSenha"
          max-width="600px"
        >
      <v-card>
        <v-card-title class="headline">
          <div class="title accent--text accent44">Esqueci Minha Senha</div>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="cpfEsqueciMinhaSenha"
                label="Insira seu CPF"
                single-line
                hide-details
                v-mask="maskCpf"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary" small
            :loading="isLoading" 
            text
            @click="esqueciMinhaSenha()"
          >
            Enviar
            <v-icon right dark>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!-- 
  ////////////////////////////////
-->

<!-- 
  Dialog Cadastrar Minha Senha
  ////////////////////////////////
-->
    <v-dialog
          v-model="dialogCadastrarMinhaSenha"
          max-width="600px"
        >
      <v-card>
        <v-card-title class="headline">
          <div class="title accent--text accent44">Cadastrar Minha Senha</div>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="cpfCadastrarMinhaSenha"
                label="Insira seu CPF"
                single-line
                hide-details
                v-mask="maskCpf"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary" small
            :loading="isLoading"
            text
            @click="cadastrar()"
          >
            Enviar
            <v-icon right dark>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!-- 
  ////////////////////////////////
-->

          <v-card class="elevation-12">            
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
            </v-toolbar>
            
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Login"
                  name="login"
                  prepend-icon="person"
                  v-model="usuario.usuario"
                  type="text"
                  autofocus="true"
                ></v-text-field>
                <v-text-field
                  id="senha"
                  label="Senha"
                  name="senha"
                  v-model="usuario.senha"
                  prepend-icon="lock"
                  type="password"
                  v-on:keydown.enter="singin(usuario)"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-row>
                <v-col class="d-flex justify-end align-center">    
                  <v-btn color="primary" small v-on:keydown.enter="singin(usuario)" v-on:click="singin(usuario)" :loading="isLoading">Login</v-btn>
                </v-col>
              </v-row>              
            </v-card-actions>
          </v-card>
        </v-flex>
       </v-layout>
    </v-container>
  </v-content>
</template>

<script>

import { mask } from 'vue-the-mask';

export default {
  created(){
     localStorage.setItem("token_hemoam", null);
  },
   directives: {
    mask
  },
  name:'Auth',
  data:function(){
    return {
      shoSignup: false,
      usuario: {},
      cpfEsqueciMinhaSenha: '',
      dialogEsqueciMinhaSenha: false,
      cpfCadastrarMinhaSenha: '',
      dialogCadastrarMinhaSenha: false,
      maskCpf: '###.###.###-##',
      showAlert: false,
      isLoading: false,
      mensagemSucesso: '',
    }
  },
  methods:{
    singin(user){
      this.isLoading = true;
      this.$http.post('/login',user)
      .then(res => {
            this.isLoading = false;
            localStorage.setItem("token_hemoam", res.data.token);
            localStorage.setItem("usuario", res.data.usuario);
            this.$router.push({name: 'transfusoes'},{});
          },
          () =>{
              this.isLoading = false;
              alert('Usuário ou senha inválidos!');
          })
    }
  }
}
</script>

<style>

</style>