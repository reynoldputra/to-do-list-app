<template>
  <div class="d-flex justify-content-center"  ref="homeCont">
    <div>
      <div class="mt-5" style="color: #bdbdbd;" >
        <a v-if="isHome" @click="showModal" class="text-decoration-none text-muted">Add a new task ...</a>
        <div class="row-cols-auto my-3" style="width:48rem;">
          <div v-for="(value, key) in categories" :key="key" class="d-inline my-2 mx-2 col" @click="test">
              <input v-model="filter" :value="key" type="checkbox" class="btn-check" :id="key" autocomplete="off" style="display: hidden;">
              <label class="btn btn-outline-secondary rounded-pill py-0 px-2" :for="key"><span style="font-size: 12px;">{{ value.name }}</span></label>
          </div>
        </div>
      </div>
      <template v-for="(value, key) in tasks" :key="key">
        <TaskCard v-if="(filter.some(r => value.category.indexOf(r) >= 0) || filter.length == 0) && value.status == !isHome" :id="key" :task="value" @delete="deleteId = $event" :callback="fillNewTask" :taskDone="taskDone"  />
      </template>
   </div>
  </div>
  <div class="modal fade" ref="staticBackdrop" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-4">
              <form class="form-floating">
                <h4><input v-model="newTask.title" type="text" class="form-control-plaintext p-2" id="staticEmail" placeholder="Task Title Here ..."></h4>
                <hr class="text-black">
                <input v-model="newTask.date" id="startDate" class="form-control py-0 border-0 w-50 shadow-none" type="date" />
                <textarea v-model="newTask.desc" class="form-control border-0 text-black" placeholder="Description..." style="height: 200px;"></textarea>
              </form> 
              
              <div class="p-2 row-cols-auto">
                <div class="d-inline mx-1 my-1 col" v-for="(value, key) in categories" :key="key" >
                  <input v-model="newTask.category" type="checkbox" class="btn-check" autocomplete="off" :id="key+'_new'" :value="key">
                  <label class="btn btn-outline-secondary rounded-pill py-0 px-2" :for="key+'_new'" ><span style="font-size: small;">{{ value.name }}</span></label>
                </div>
              </div>

              <div class="d-flex justify-content-end my-3">
                  <button type="button" class="btn btn-secondary mx-2" data-bs-dismiss="modal" >Cancel</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="margin-right: 30px;" @click="createTask">Update</button>
              </div>
            </div>
        </div>
  </div>
  <div class="modal fade" ref="staticBackdrop" id="editTask" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content p-4">
          <form class="form-floating">
            <h4><input v-model="newTask.title" type="text" class="form-control-plaintext p-2" id="staticEmail" placeholder="Task Title Here ..."></h4>
            <hr class="text-black">
            <input v-model="newTask.date" id="startDate" class="form-control py-0 border-0 w-50 shadow-none" type="date" />
            <div class="form-floating">
              <textarea v-model="newTask.desc" class="form-control border-0" id="floatingTextarea" style="height: 200px;"></textarea>
            </div>
          </form>
          
          <div class="p-2 row-cols-auto">
            <div class="d-inline mx-1 my-1 col" v-for="(value, key) in categories" :key="key" >
              <input v-model="newTask.category" type="checkbox" class="btn-check" autocomplete="off" :id="key+'_new'" :value="key">
              <label class="btn btn-outline-secondary rounded-pill py-0 px-2" :for="key+'_new'" ><span style="font-size: small;">{{ value.name }}</span></label>
            </div>
          </div>

          <div class="d-flex justify-content-end my-3">
              <button type="button" class="btn btn-secondary mx-2" data-bs-dismiss="modal" >Cancel</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="margin-right: 30px;" @click="updateTask">Update</button>
          </div>
        </div>
    </div>
  </div>
  <div class="modal fade" ref="confirmModal" id="confirmModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content p-4">
            <h3 class="text-black p-5">Are you sure delete this content ?</h3>
            <div class="d-flex justify-content-end my-3">
                <button type="button" class="btn btn-secondary mx-2" data-bs-dismiss="modal" >No</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" style="margin-right: 30px;" @click="deleteTask">Yes</button>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
  import TaskCard from '../components/TaskCard.vue'
  import NavBar from '../components/NavBar.vue'
  import {
      collection,
      doc,
      onSnapshot,
      addDoc,
      updateDoc,
      deleteDoc
  } from "firebase/firestore";
  import { db } from '../firebase/firebase'

  export default {
    components: {
      TaskCard,
      NavBar
    },
    data(){
      return {
        categories: {},
        tasks: {},
        newTask: {
          id: "",
          title: "",
          desc: "",
          date: "",
          category: []
        },
        deleteId: "",
        filter: [],
        homeCont: null,
        loader: null,
        isHome: true,
      }
    },
    methods: {
      emptyNewTask(){
        this.newTask = {
          id: "",
          title: "",
          desc: "",
          date: "",
          category: []
        }
      },
      fillNewTask(id){
        this.emptyNewTask()
        let task = this.tasks[id]
        this.newTask = {
          ...task,
          id
        }
      },
      showModal(){
        this.emptyNewTask()
        $(document).ready(function(){
                $("#staticBackdrop").modal('show');
            });
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
      async getTask(){
        try {     
            const q = collection(db, "task");  
            onSnapshot(q, { includeMetadataChanges : true }, (querySnapshot) => {
              let temp = {}
              querySnapshot.forEach((val) => {
                  temp[val.id] = val.data()
              });
              Object.entries(temp).forEach(val => {
                  val[1].categories = []
                  val[1].category.forEach((catId) => {
                    val[1].categories.push(this.categories[catId])
                  })
              })
              this.tasks = temp
              localStorage.setItem("tasks", JSON.stringify(this.tasks))
              console.log(this.tasks)
            });
        } catch(err) {  
          console.log(err)
        }
      },
      async createTask(){
        this.startLoader()
        await addDoc(collection(db, "task"), {
          ...this.newTask,
          status: false
        }).then(() => {
          this.endLoader();
          this.emptyNewTask()
        })
      },
      async deleteTask(){
        this.startLoader()
        await deleteDoc(doc(db, "task", this.deleteId))
        .then(() => {
          this.endLoader();
        })
      },
      async updateTask(){
        this.startLoader()
        let task = this.newTask
        await updateDoc(doc(db, "task", task.id), {
            title: task.title,
            desc: task.desc,
            date: task.date,
            category: task.category
        }).then(() => {
          this.endLoader();
        })
      },
      async taskDone(id){
        this.startLoader()
        await updateDoc(doc(db, "task", id), {
          status: !this.tasks[id].status
        }).then(() => {
          this.endLoader();
        })
      },
      startLoader(){
        this.homeCont = this.$refs.homeCont;
        this.loader = this.$loading.show({
            container: this.homeCont,
            loader: "dots",
            color: "black",
        });
      },
      endLoader(){
        this.loader.hide()
      }
    },
    created() {
      if(this.$route.name == "done"){
        this.isHome = false
      } else {
        this.isHome = true
      }
      if(localStorage.categories){
        this.categories = JSON.parse(localStorage.getItem("categories"));
      }
      this.getCategory()
      if(localStorage.tasks){
        this.tasks = JSON.parse(localStorage.getItem("tasks"));
      }
      this.getTask()

    },
    mounted() {
      this.getTask()
    }
  }

</script>


<style scoped>

</style>