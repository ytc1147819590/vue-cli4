<template>
    <div>
        <div>11</div>
        <button @click="btn">按钮</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    methods: {
        btn() {
            this.$store.commit('SET_NAME', '55')
                   console.log(this.name)
        }
    },
    computed: {
        ...mapGetters(['name'])
    },
    mounted() {
        console.log(this.name)
    }
}
</script>

