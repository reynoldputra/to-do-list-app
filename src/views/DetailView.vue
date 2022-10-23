<template>
    <div class="d-flex justify-content-center">
        <div class="task-card rounded px-5 py-5 d-flex my-4" style="width: 49rem">
            <div class="w-100" style="margin-left: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-square link-secondary mx-2 mb-4" viewBox="0 0 16 16" @click="this.$router.push('/')">
                    <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
                <div class="mx-2 mb-3">
                    <h3>{{ detailTask.title }}</h3>
                </div>
                <div class="pb-3 d-flex justify-content-between">
                    <div class="d-flex">
                        <span v-for="val in detailTask.categories" :key="val" class="badge rounded-pill mx-1" :style="{backgroundColor: val.color}">{{ val.name }}</span>
                    </div>
                </div>
                <p class="mx-2">{{ detailTask.desc }}</p>
            </div>
            
        </div>
    </div>
</template>

<script>
    import { db } from '../firebase/firebase'
    import { getDoc, doc, collection, onSnapshot } from 'firebase/firestore'

    export default {
        data() {
            return {
                id : this.$route.params.id,
                detailTask : {},
                categories : {}
            }
        },
        methods: {
            async getDetailTask(){
                let temp = await  getDoc(doc(db, "task", this.id))
                let val = temp.data()
                  val.categories = []
                  val.category.forEach((catId) => {
                        val.categories.push(this.categories[catId])
                  })
              
                this.detailTask = val
                console.log(this.detailTask)
            },
            async getCategory(){  
                try { 
                    const q = collection(db, "category");
                    onSnapshot(q, (querySnapshot) => {
                    let temp = {}
                    querySnapshot.forEach((val) => {
                        temp[val.id] = val.data()
                    });
                    this.categories = temp
                    localStorage.setItem("categories", JSON.stringify(this.categories))
                    });
                } catch(err) {  
                    console.log(err)
                }
            },
        },
        created() {
            if(localStorage.categories){
                this.categories = JSON.parse(localStorage.getItem("categories"));
                console.table(this.categories)
            }
            this.getCategory()
            this.getDetailTask()
        }
    }
</script>

<style scoped>
    .task-card{
        background-color: #1D1D1D;
        width: 48rem;
    }
</style>