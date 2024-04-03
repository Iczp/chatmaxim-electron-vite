<script setup lang="ts">
import { computed, onActivated, reactive, ref, shallowRef } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { usePayload } from '../../commons/usePayload';
import { useRoute } from 'vue-router';

import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

const payload = usePayload<ViewerPayload>();
const currentIndex = ref(payload.value?.currentIndex || 0);
const msg = computed(() => payload.value?.messages[currentIndex.value]);

const url = computed(() => msg.value?.content?.url);

// https://github.com/surmon-china/vue-codemirror

const code = ref(`console.log('Hello, world!')
import {parser} from "./syntax.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const EXAMPLELanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        Identifier: t.variableName,
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        "( )": t.paren
      })
    ]
  }),
  languageData: {
    commentTokens: {line: ";"}
  }
})

export function EXAMPLE() {
  return new LanguageSupport(EXAMPLELanguage)
}
`);


const extensions = [ javascript(), oneDark];

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload: any) => {
  view.value = payload.view;
};

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce((r: any, range: any) => r + range.to - range.from, 0);
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;
  // more state info ...
  // return ...
};
const log = console.log;

const editorOptions = reactive({
  tabSize: 2,
  mode: 'javascript', // 设置编辑器的语言模式
  theme: 'ambiance', // 设置编辑器的主题
  lineNumbers: true, // 是否显示行号
  line: true, // 是否显示行数边框
  // 其他选项可以根据需要添加
});
onActivated(() => {
  console.log('onActivated');
});
</script>

<template>
  <codemirror
    v-model="code"
    placeholder="Code goes here..."
    :style="{ height: '100%' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="log('change', $event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
</template>

<style scoped></style>
