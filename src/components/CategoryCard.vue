<template>
    <div class="task-card rounded px-5 py-3 d-flex my-4">
        <div class="w-100" style="margin-left: 20px;">
            <div class="d-flex justify-content-between">
                <span class="badge rounded-pill mx-1" :style="{backgroundColor: color}">{{ name }}</span>
                <div class="d-flex">
                    <svg @click="showConfirm" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3 link-secondary mx-2" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                    <svg @click="showUpdate" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen link-secondary mx-2" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        name : String,
        color : String,
        id : String,
        callback : {
            type : Function
        }
    },
    methods: {
        showConfirm(){
            $(document).ready(function(){
                    $("#confirmModal").modal('show');
            });
            this.$emit("delete", this.$props.id)
        },
        showUpdate(){
            this.callback(this.$props.id)
            $(document).ready(function(){
                    $("#updateCategory").modal('show');
            });
        },
    }
}

</script>


<style scoped>
    .task-card{
        background-color: #1D1D1D;
        width: 48rem;
    }
    
    .task-card:hover{
        box-shadow: 0px 0px 12px 1px rgba(118,118,118,0.75);
        -webkit-box-shadow: 0px 0px 12px 1px rgba(118,118,118,0.75);
        -moz-box-shadow: 0px 0px 12px 1px rgba(118,118,118,0.75);
    }


</style>