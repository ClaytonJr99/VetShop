<template>
  <div>
    <q-dialog v-model="updateModal" class="m-modal-update">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{isNew ? 'Novo medicamento' : 'Editar medicamento'}}</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="m-modal-update-">
          <q-form
            @submit.prevent.stop="onSubmit"
            class="m-modal-update-form"
          >
          <div>
            <div class="m-modal-update_field">
              <span class="m-update_field-label">Nome:</span>
              <q-input v-model="nome"
                :rules="[val => !!val || 'Campo obrigatorio!']"
                ref="nome"
                class="m-update_field-input"/>
            </div>
            <div class="m-modal-update_field">
              <span class="m-update_field-label">Descrição:</span>
              <q-input v-model="descricao"
              :rules="[val => !!val || 'Campo obrigatorio!']"
              ref="descricao"
              class="m-update_field-input text-area" />
            </div>
            <div class="m-modal-update_field">
              <span class="m-update_field-label">Quantidade:</span>
              <q-input type="number" v-model="quantidade"
              :rules="[val => val >= 0 || 'Não pode ter valor negativo!']"
              ref="quantidade"
              class="m-update_field-input"/>
            </div>
          </div>
          <div>
            <div class="m-modal-update_field">
              <span class="m-update_field-label">Preço de venda:</span>
              <q-input type="number" v-model="precoVenda" class="m-update_field-input"
              :rules="[val => val >= 0 || 'Não pode ter valor negativo!']"
              ref="precoVenda"/>
            </div>
            <div class="m-modal-update_field">
              <span class="m-update_field-label">Preço de compra:</span>
              <q-input type="number" v-model="precoCompra" class="m-update_field-input"
              :rules="[val => val >= 0 || 'Não pode ter valor negativo!']"
              ref="precoCompra"/>
            </div>
            <div class="m-modal-update_field">
              <span class="m-update_field-label">Fornecedor:</span>
              <q-input v-model="fornecedor" class="m-update_field-input"
              :rules="[val => !!val || 'Campo obrigatorio!']"
                ref="fornecedor"/>
            </div>
          </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn class="a-btn_external"
          no-caps flat label="Cancelar" @click="closeModal"/>
          <q-btn class="a-btn_external"
           no-caps flat label="Salvar" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import store from '../store';

export default {
  nome: 'updateModal',
  props: {
    updateModal: Boolean,
    produto: Object,
    isNew: Boolean,
  },
  data() {
    return {
      nome: '',
      descricao: '',
      precoVenda: 0,
      precoCompra: 0,
      fornecedor: '',
      quantidade: 0,
      id: 0,
    };
  },
  methods: {
    async onSubmit() {
      this.$refs.nome.validate();
      this.$refs.quantidade.validate();
      this.$refs.precoCompra.validate();
      this.$refs.precoVenda.validate();
      this.$refs.fornecedor.validate();
      this.$refs.descricao.validate();
      if (this.$refs.nome.hasError
      || this.$refs.quantidade.hasError
      || this.$refs.precoVenda.hasError
      || this.$refs.precoCompra.hasError
      || this.$refs.fornecedor.hasError
      || this.$refs.descricao.hasError
      ) {
        this.formHasError = true;
      } else {
        if (!this.isNew) {
          this.formatData();
        } else {
          const payload = {
            nome: this.nome,
            precoVenda: this.precoVenda,
            descricao: this.descricao,
            quantidade: this.quantidade,
            precoCompra: this.precoCompra,
            fornecedor: this.fornecedor,
          };
          const response = await store().dispatch('medicine/createMedicine', payload);
          if (response.id) {
            await store().dispatch('medicine/getMedicine');
            this.$q.notify({
              color: 'positive',
              message: 'Item criado com sucesso!',
              icon: 'done',
            });
          } else {
            this.$q.notify({
              color: 'negative',
              message: 'Ocorreu algum erro!',
              icon: 'report_problem',
            });
          }
        }
        this.closeModal();
      }
    },
    closeModal(value) {
      if (value) this.$emit('closeModal', value);
      else this.$emit('closeModal');
    },
    async formatData() {
      const payload = {
        nome: this.nome,
        precoVenda: this.precoVenda,
        descricao: this.descricao,
        quantidade: this.quantidade,
        precoCompra: this.precoCompra,
        fornecedor: this.fornecedor,
        medicamentoId: this.id,
      };
      const response = await store().dispatch('medicine/updateMedicine', payload);
      if (response) {
        await store().dispatch('medicine/getMedicine');
        this.$q.notify({
          color: 'positive',
          message: 'Item editado com sucesso!',
          icon: 'done',
        });
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Ocorreu algum erro!',
          icon: 'report_problem',
        });
      }
    },
  },
  watch: {
    produto(value) {
      if (value.id) {
        this.nome = value.nome;
        this.descricao = value.descricao;
        this.precoVenda = value.precoVenda;
        this.precoCompra = value.precoCompra;
        this.fornecedor = value.fornecedor;
        this.quantidade = value.quantidade;
        this.id = value.id;
      }
    },
  },
  computed: {
  },
};
</script>
