<template>
  <div class="q-pa-md row items-start q-gutter-md cmp-car">
    <q-card class="cmp-car__element">
      <q-card-section>
        <div class="text-h6 q-mb-xs">
          {{ car.data.make }} {{ car.data.model }}
        </div>
        <div class="row no-wrap items-center">
          <!-- <q-rating
            readonly
            size="18px"
            v-model="stars"
            :max="5"
            color="primary"
          />
          <span class="text-caption text-grey q-ml-sm">4.2 (551)</span> -->
        </div>
      </q-card-section>
      <img class="q-pa-md" src="../../public/car-placeholder.png" />

      <q-list>
        <q-item clickable @click="handleEdit">
          <q-item-section avatar>
            <q-icon color="primary" name="edit_note" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Specs</q-item-label>
            <q-item-label caption>View/Update car data</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="handleReview">
          <q-item-section avatar>
            <q-icon color="orange" name="reviews" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Reviews</q-item-label>
            <q-item-label caption>Read & Write reviews</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :disable="!this.isLoggedIn" @click="confirm">
          <q-item-section avatar>
            <q-icon color="red" name="delete_forever" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Delete</q-item-label>
            <q-item-label caption>Delete car from db</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { Car } from './models';
import Utils from './utils';
import Axios from 'axios';
import { useQuasar } from 'quasar';
export default defineComponent({
  name: 'CarCard',
  props: ['car'],
  setup(props) {
    const token = Utils.getExpiringLocalStorage('jwt-auth');
    let isLoggedIn = ref(token ? true : false);
    const $q = useQuasar();
    function confirm() {
      $q.dialog({
        title: 'Confirm',
        message: 'This will delete the car from the database',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        Utils.setDefaultHeader(Utils.getExpiringLocalStorage('jwt-auth'));
        Axios.delete(Utils.URLs.car.deleteCar(props.car.id), {
          withCredentials: true,
        })
          .then((response) => {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: response.data.message,
            });
          })
          .catch((err) => {
            $q.notify({
              color: 'red-8',
              textColor: 'white',
              icon: 'cloud_done',
              message: err.response?.data.message,
            });
          });
      });
    }

    return {
      carObj: ref(props.car as Car),
      isLoggedIn,
      confirm,
    };
  },
  methods: {
    handleEdit() {
      void this.$router.push(`/specs/${this.carObj.id}`);
    },
    handleReview() {
      void this.$router.push(`/reviews/${this.carObj.id}`);
    },
  },
});
</script>
<style lang="scss" scoped>
.cmp-car {
  width: 30%;

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
}
</style>
