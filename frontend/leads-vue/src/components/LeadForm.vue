<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/api'
import { persistUtmsFromUrl, readPersistedUtms } from '@/utils/tracking'
import { VForm } from 'vuetify/components'
interface LeadForm {
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
}

export default defineComponent({
  name: 'LeadForm',
  setup() {
    const router = useRouter()
    const form = reactive<LeadForm>({
      name: '',
      email: '',
      phone: '',
      jobTitle: '',
      birthDate: '',
      message: '',
    })
    const formRef = ref<InstanceType<typeof VForm> | null>(null)
    const snackbar = ref(false)
    const timeout = ref(3000)
    const text = ref('')
    const color = ref('red')

    const urlParams = new URLSearchParams(window.location.search)
    form.utmSource = urlParams.get('utm_source') || undefined
    form.utmMedium = urlParams.get('utm_medium') || undefined
    form.utmCampaign = urlParams.get('utm_campaign') || undefined
    form.utmTerm = urlParams.get('utm_term') || undefined
    form.utmContent = urlParams.get('utm_content') || undefined
    form.gclid = urlParams.get('gclid') || undefined
    form.fbclid = urlParams.get('fbclid') || undefined

    // persist any UTM/gclid/fbclid from the URL and rehydrate persisted values
    persistUtmsFromUrl()
    const persisted = readPersistedUtms()
    if (persisted) {
      form.utmSource = form.utmSource || persisted.utm_source
      form.utmMedium = form.utmMedium || persisted.utm_medium
      form.utmCampaign = form.utmCampaign || persisted.utm_campaign
      form.utmTerm = form.utmTerm || persisted.utm_term
      form.utmContent = form.utmContent || persisted.utm_content
      form.gclid = form.gclid || persisted.gclid
      form.fbclid = form.fbclid || persisted.fbclid
    }

    const formValid = computed(() => {
      return (
        !!form.name &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
        /^(1[1-9]|[4689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/.test(
          form.phone,
        ) &&
        !!form.jobTitle &&
        !!form.birthDate &&
        !!form.message
      )
    })

    const submitForm = async () => {
      if (!formRef.value?.validate()) return
      await apiClient
        .post('/api/leads', form)
        .then(() => {
          snackbar.value = true
          text.value = 'Lead cadastrado com sucesso!'
          color.value = 'success'
          Object.assign(form, {
            name: '',
            email: '',
            phone: '',
            jobTitle: '',
            birthDate: '',
            message: '',
          })
          formRef.value?.resetValidation()
          router.push('/')
        })
        .catch(() => {
          snackbar.value = true
          text.value = 'Erro ao cadastrar lead'
          color.value = 'red'
        })
    }

    return { form, formRef, formValid, submitForm, snackbar, timeout, text, color }
  },
})
</script>

<template>
  <v-container fluid class="mx-auto" style="max-width: 800px">
    <v-card elevation="2" class="pa-4">
      <v-card-title class="text-h5">Cadastro de Lead</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm" ref="formRef">
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Nome"
                filled
                :rules="[(v) => !!v || 'Nome é obrigatório']"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
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
                v-model="form.phone"
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
                v-model="form.jobTitle"
                label="Cargo"
                filled
                :rules="[(v) => !!v || 'Cargo é obrigatório']"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.birthDate"
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
                v-model="form.message"
                label="Mensagem"
                filled
                :rules="[(v) => !!v || 'Mensagem é obrigatória']"
                required
                rows="4"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-btn type="submit" color="primary" large :disabled="!formValid">Enviar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
        {{ text }}

        <template v-slot:actions>
          <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-container>
</template>
