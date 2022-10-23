<template>

    <div class="d-flex justify-content-center min-vh-100" ref="homeCont">
      <div>
        <div class="mt-5 w-100" style="color: #bdbdbd;" @click="showModal">
            <a class="text-decoration-none text-muted">Add a new category ... </a><br/>
        </div>
        <div v-for="(value, key) in categories" v-bind:key="key">
          <CategoryCard :name="value.name" :color="value.color" :id="key" @delete="deleteId = $event" :callback="fillNewCtg" />
        </div>
     </div>
     
    </div>
    <div class="modal fade" ref="staticBackdrop" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content p-4">
                <form class="form-floating">
                  <h4><input v-model="newCategory.name" type="text" class="form-control-plaintext p-3" id="staticEmail" placeholder="New Category Here ..."></h4>
                </form>
                <input v-model="newCategory.color" type="color" class="form-control form-control-color mx-3 w-50" id="exampleColorInput" placeholder="#563d7c" title="Choose your color">
                <div class="d-flex justify-content-end my-3">
                    <button type="button" class="btn btn-secondary mx-2" data-bs-dismiss="modal" >Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="margin-right: 30px;" @click="createCategory">Create</button>
                </div>
              </div>
          </div>
    </div>

    <div class="modal fade" ref="staticBackdrop" id="updateCategory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content p-4">
                <form class="form-floating">
                  <h4><input v-model="newCategory.name" type="text" class="form-control-plaintext p-3" id="staticEmail" placeholder="New Category Here ..."></h4>
                </form>
                <input v-model="newCategory.color" type="color" class="form-control form-control-color mx-3 w-50" id="exampleColorInput" placeholder="#563d7c" title="Choose your color">
                <div class="d-flex justify-content-end my-3">
                    <button type="button" class="btn btn-secondary mx-2" data-bs-dismiss="modal" >Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="margin-right: 30px;" @click="updateCategory">Update </button>
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
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" style="margin-right: 30px;" @click="deleteCategory">Yes</button>
                </div>
              </div>
          </div>
    </div>

  </template>
  
  <script>
    import CategoryCard from '../components/CategoryCard.vue'
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
      CategoryCard,
      NavBar
      },
      data() {
        return {
          newCategory: {
            name: '',
            color: '',
            id: ''
          },
          isSuccess: false,
          isErrorr: false,
          categories: {},
          deleteId: "",
          updateId: "",
          loader: null,
          isHome: true,
        }
      },
      methods: {
        showModal(){
          $(document).ready(function(){
            $("#staticBackdrop").modal('show');
          });
        },
        fillNewCtg(id){
          this.newCategory.name = this.categories[id].name
          this.newCategory.color = this.categories[id].color
          this.newCategory.id = id
          
        },
        async updateCategory(){
          this.startLoader()
          await updateDoc(doc(db, "category", this.newCategory.id), {
            name : this.newCategory.name,
            color: this.newCategory.color
          }).then( () => {
            this.endLoader()
            this.newCategory.name = ""
            this.newCategory.color = ""
            this.newCategory.id = ""
          })
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
              console.log(this.categories)
            });
          } catch(err) {  
            console.log(err)
          }
        },
        async createCategory(){
          this.startLoader()
          await addDoc(collection(db, "category"), {
            name : this.newCategory.name,
            color : this.newCategory.color
          }).then(() => {
            this.endLoader()
            this.newCategory.name = ""
            this.newCategory.color = ""
          })
        },
        async deleteCategory(){
          this.startLoader()
          await deleteDoc(doc(db, "category", this.deleteId))
          .then(() => {
            this.endLoader()
            this.deleteId = "" 
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
      async created() {
        if(localStorage.categories){
          this.categories = JSON.parse(localStorage.getItem("categories"));
          console.table(this.categories)
        }
        await this.getCategory()
      },
      async onMounted() {
        await this.getCategory()
      }
    }
  
  </script>
  
  
  <style scoped>
  
  </style>