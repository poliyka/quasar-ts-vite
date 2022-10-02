<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
    <q-btn
      color="deep-orange"
      glossy
      label="ChangeMode"
      @click="toggleMode"
      icon="fa fa-recycle"
    />
    爺爺今年已經 {{ states.old }} 歲了
    <button @click="handleAfterBirthday">幫爺爺慶生結束</button>
    <img :src="image" alt="">
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, Ref, toRefs } from 'vue';
import { Todo, Meta } from '../interfaces/types';
import { useQuasar } from 'quasar';
import { watch, reactive } from 'vue';
import { api } from 'boot/axios';
import { injectStrict, statesKey, genKey } from '../interfaces/injects'

import image from '/icons/favicon-128x128.png'

interface Student {
  firstName: string;
  lastName: string;
  year: number;
  id: number;
}

let st1: Student = {
  firstName: 'James',
  lastName: 'aa',
  year: 123,
  id: 1,
};

let st2: Student = {
  firstName: 'James',
  lastName: 'aa',
  year: 123,
  id: 2,
};

interface IStudentRecord {
  [key: string]: Student;
}

let st: IStudentRecord = { '001': st1, '002': st2 };

console.log(st);

function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1;
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'ExampleComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [],
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  setup(props) {
    const { title, todos } = toRefs(props);
    const $q = useQuasar();
    const grandpaStates = injectStrict(statesKey);
    const handleAfterBirthday = injectStrict(genKey);
    const states = reactive({
      old: computed(() => grandpaStates?.value.old),
    });
    async function toggleMode(): Promise<void> {
      console.log(
        '🚀 ~ file: ExampleComponent.vue ~ line 76 ~ toggleMode ~ title',
        title.value
      );
      $q.dark.set(!$q.dark.isActive);
      $q.loadingBar.setDefaults({
        color: 'green',
        size: '15px',
        position: 'bottom',
      });
      $q.loadingBar.start(500);
      $q.loadingBar.increment(0.36);
      await api
        .get('F-C0032-001', {
          params: {
            Authorization: 'CWB-CF1173BB-32CC-4174-A6DD-B185D929A6D0',
            limit: 2,
            format: 'JSON',
            sort: 'time',
            locationName: '桃園市',
          },
        })
        .then((res) => {
          console.table(res.data);
          $q.notify({
            color: 'positive',
            position: 'top',
            message: 'success',
            icon: 'report_problem',
          });
          console.log('inside');
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          /* 不論失敗成功皆會執行 */
          $q.loadingBar.stop();
        });
      console.log('outside');
    }
    watch(
      () => $q.dark.isActive,
      (val) => {
        console.log(val ? 'On dark mode' : 'On light mode');
      }
    );
    return {
      ...useClickCount(),
      ...useDisplayTodo(todos),
      states,
      handleAfterBirthday,
      toggleMode,
      image,
    };
  },
});
</script>
