<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import apiClient from '@/api/api'

interface LeadDto {
  id: string
  name: string
  email: string
  phone: string
  jobTitle: string
  birthDate: string
  message: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  fbclid?: string
  createdAt: string
}

export default defineComponent({
  name: 'LeadDetails',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const lead = ref<LeadDto | null>(null)
    const isEditing = ref(false)
    const editForm = ref<Partial<LeadDto>>({})
    const snackbar = ref(false)
    const timeout = ref(3000)
    const text = ref('')
    const color = ref('red')

    const fetchLead = async () => {
      await apiClient
        .get(`/api/leads/${route.params.id}`)
        .then((response) => {
          lead.value = response.data
          editForm.value = {
            ...response.data,
            birthDate: parseDdMmYyyyToDate(response.data.birthDate)?.toISOString().substring(0, 10),
          }
        })
        .catch(() => {
          snackbar.value = true
          text.value = 'Erro ao carregar lead'
          router.push('/admin')
        })
    }
    const parseDdMmYyyyToDate = (input: string) => {
      const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
      if (!m) return null
      const [, dd, mm, yyyy] = m
      // criar Date: new Date(year, monthIndex, day)
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    }

    const enableEdit = () => {
      isEditing.value = true
    }

    const updateLead = async () => {
      await apiClient
        .put(`/api/leads/${route.params.id}`, editForm.value)
        .then(() => {
          snackbar.value = true
          text.value = 'Lead atualizado com sucesso!'
          color.value = 'green'
          lead.value = { ...lead.value, ...editForm.value } as LeadDto
          isEditing.value = false
        })
        .catch(() => {
          snackbar.value = true
          text.value = 'Erro ao atualizar lead'
        })
    }

    onMounted(fetchLead)

    return { lead, isEditing, editForm, enableEdit, updateLead, snackbar, timeout, text, color }
  },
})
</script>

<template>
  <v-container fluid class="mx-auto" style="max-width: 800px">
    <v-card elevation="2" class="pa-4">
      <v-card-title class="text-h5">Detalhes do Lead</v-card-title>
      <v-card-text v-if="lead">
        <v-row>
          <v-col cols="12" sm="6"><strong>Nome:</strong> {{ lead.name }}</v-col>
          <v-col cols="12" sm="6"><strong>E-mail:</strong> {{ lead.email }}</v-col>
          <v-col cols="12" sm="6"><strong>Telefone:</strong> {{ lead.phone }}</v-col>
          <v-col cols="12" sm="6"><strong>Cargo:</strong> {{ lead.jobTitle }}</v-col>
          <v-col cols="12" sm="6"><strong>Data de Nascimento:</strong> {{ lead.birthDate }}</v-col>
          <v-col cols="12"><strong>Mensagem:</strong> {{ lead.message }}</v-col>
          <v-col cols="12" sm="6"><strong>UTM Source:</strong> {{ lead.utmSource || 'N/A' }}</v-col>
          <v-col cols="12" sm="6"><strong>UTM Medium:</strong> {{ lead.utmMedium || 'N/A' }}</v-col>
          <v-col cols="12" sm="6"
            ><strong>UTM Campaign:</strong> {{ lead.utmCampaign || 'N/A' }}</v-col
          >
          <v-col cols="12" sm="6"><strong>UTM Term:</strong> {{ lead.utmTerm || 'N/A' }}</v-col>
          <v-col cols="12" sm="6"
            ><strong>UTM Content:</strong> {{ lead.utmContent || 'N/A' }}</v-col
          >
          <v-col cols="12" sm="6"><strong>GCLID:</strong> {{ lead.gclid || 'N/A' }}</v-col>
          <v-col cols="12" sm="6"><strong>FBCLID:</strong> {{ lead.fbclid || 'N/A' }}</v-col>
          <v-col cols="12"><strong>Criado em:</strong> {{ lead.createdAt }}</v-col>
        </v-row>
        <v-btn color="primary" large @click="enableEdit" class="mt-4">Editar</v-btn>
        <v-form v-if="isEditing" @submit.prevent="updateLead" class="mt-4">
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editForm.name"
                label="Nome"
                filled
                :rules="[(v) => !!v || 'Nome é obrigatório']"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editForm.email"
                label="E-mail"
                filled
                :rules="[
                  (v) => !!v || 'E-mail é obrigatório',
                  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido',
                ]"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-mask-input
                v-model="editForm.phone"
                label="Telefone"
                filled
                mask="(##) #####-####"
                :rules="[
                  (v) => !!v || 'Telefone é obrigatório',
                  (v) =>
                    /^(1[1-9]|[4689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/.test(
                      v,
                    ) || 'Formato: (XX) XXXXX-XXXX',
                ]"
                required
                class="py-2"
              ></v-mask-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editForm.jobTitle"
                label="Cargo"
                filled
                :rules="[(v) => !!v || 'Cargo é obrigatório']"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :disabled="true"
                v-model="editForm.birthDate"
                label="Data de Nascimento"
                type="date"
                filled
                :rules="[(v) => !!v || 'Data é obrigatória']"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editForm.message"
                label="Mensagem"
                filled
                :rules="[(v) => !!v || 'Mensagem é obrigatória']"
                required
                rows="4"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-btn type="submit" color="success" large>Salvar</v-btn>
              <v-btn color="grey" large @click="isEditing = false" class="ml-2">Cancelar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" large to="/admin">Voltar</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
      {{ text }}

      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
