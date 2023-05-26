<template>
	<div>
        <form @submit.prevent="proceed" @keydown="stockTransferForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_transfer_date')}}</label>
                        <datepicker v-model="stockTransferForm.date" :bootstrapStyling="true" @selected="stockTransferForm.errors.clear('date')" :placeholder="trans('inventory.stock_transfer_date')"></datepicker>
                        <show-error :form-name="stockTransferForm" prop-name="date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_transfer_return_due_date')}}</label>
                        <datepicker v-model="stockTransferForm.return_due_" :bootstrapStyling="true" @selected="stockTransferForm.errors.clear('return_due_')" :placeholder="trans('inventory.stock_transfer_return_due_date')"></datepicker>
                        <show-error :form-name="stockTransferForm" prop-name="return_due_"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <div class="radio radio-success m-t-20">
                            <input type="radio" value="room" id="type_room" v-model="stockTransferForm.type" :checked="stockTransferForm.type == 'room'" name="type" @click="stockTransferForm.errors.clear('type')">
                            <label for="type_room">{{trans('asset.room')}}</label> <br />
                            <input type="radio" value="student" id="type_student" v-model="stockTransferForm.type" :checked="stockTransferForm.type == 'student'" name="type" @click="stockTransferForm.errors.clear('type')">
                            <label for="type_student">{{trans('student.student')}}</label> <br />
                            <input type="radio" value="employee" id="type_employee" v-model="stockTransferForm.type" :checked="stockTransferForm.type == 'employee'" name="type" @click="stockTransferForm.errors.clear('type')">
                            <label for="type_employee">{{trans('employee.employee')}}</label>
                        </div>
                        <show-error :form-name="stockTransferForm" prop-name="type"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group" v-if="stockTransferForm.type == 'room'">
                        <label for="">{{trans('asset.room')}}</label>
                        <v-select label="name" v-model="selected_room" name="room_id" id="room_id" :options="rooms" :placeholder="trans('inventory.select_room')" @select="onRoomSelect" @close="stockTransferForm.errors.clear('room_id')" @remove="stockTransferForm.room_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!rooms.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="stockTransferForm" prop-name="room_id"></show-error>
                    </div>
                    <div class="form-group" v-if="stockTransferForm.type == 'student'">
                        <label for="">{{trans('student.student')}}</label>
                        <v-select label="name" v-model="selected_student" name="student_id" id="student_id" :options="students" :placeholder="trans('student.select_student')" @select="onStudentSelect" @close="stockTransferForm.errors.clear('student_id')" @remove="stockTransferForm.student_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!students.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="stockTransferForm" prop-name="student_id"></show-error>
                    </div>
                    <div class="form-group" v-if="stockTransferForm.type == 'employee'">
                        <label for="">{{trans('employee.employee')}}</label>
                        <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="stockTransferForm.errors.clear('employee_id')" @remove="stockTransferForm.employee_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="stockTransferForm" prop-name="employee_id"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_transfer_description')}}</label>
                        <autosize-textarea v-model="stockTransferForm.description" rows="1" name="description" :placeholder="trans('inventory.stock_transfer_description')"></autosize-textarea>
                        <show-error :form-name="stockTransferForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="p-t-20 border-top">
                <div class="row" v-for="(detail, index) in stockTransferForm.details">
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">
                                {{trans('inventory.stock_item')}}
                                <button type="button" class="btn btn-xs btn-danger" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDelete(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button>
                            </label>
                            <v-select label="name" v-model="detail.selected_stock_item" :name="getStockItemName(index)" :id="getStockItemName(index)" :options="stock_items" :placeholder="trans('inventory.select_stock_item')" @select="onStockItemSelect" @close="stockTransferForm.errors.clear(getStockItemName(index))" @remove="onStockItemRemove">
                                <div class="multiselect__option" slot="afterList" v-if="!stock_items.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
                            <show-error :form-name="stockTransferForm" :prop-name="getStockItemName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('inventory.stock_transfer_quantity')}}</label>
                            <input class="form-control" type="text" v-model="detail.quantity" :name="getQuantityName(index)" :placeholder="trans('inventory.stock_transfer_quantity')">
                            <show-error :form-name="stockTransferForm" :prop-name="getQuantityName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">
                                {{trans('inventory.stock_item_description')}}
                            </label>
                            <input class="form-control" type="text" v-model="detail.description" :name="getDescriptionName(index)" :placeholder="trans('inventory.stock_item_description')">
                            <show-error :form-name="stockTransferForm" :prop-name="getDescriptionName(index)"></show-error>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('inventory.add_new_stock_item')}}</button>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <file-upload-input :button-text="trans('general.upload_document')" :token="stockTransferForm.upload_token" module="stock_transfer" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <button v-show="id" type="button" class="btn btn-danger " @click="$router.push('/inventory/stock/transfer')">{{trans('general.cancel')}}</button>
                <button v-if="!id" type="button" class="btn btn-danger " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
        </form>
    </div>
</template>

<script>

    export default {
        components: {},
        props: ['id'],
        data(){
            return {
                stockTransferForm: new Form({
                    type: 'room',
                    date: '',
                    return_due_date: '',
                    room_id: '',
                    student_id: '',
                    employee_id: '',
                    description: '',
                    details: [],
                    upload_token: ''
                }),
                stock_items: [],
                rooms: [],
                selected_room: null,
                employees: [],
                selected_employee: null,
                students: [],
                selected_student: null,
                module_id: '',
                clearAttachment: true
            }
        },
        mounted(){
            if(!this.id)
                this.addRow();

            if(this.id)
                this.get();
            else
                this.stockTransferForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            }, 
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/stock/transfer/pre-requisite')
                    .then(response => {
                        this.rooms = response.rooms;
                        this.students = response.students;
                        this.employees = response.employees;
                        this.stock_items = response.stock_items;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            addRow(){
                let new_index = this.stockTransferForm.details.push({
                    quantity: '',
                    stock_item_id: '',
                    description: '',
                    selected_stock_item: null
                })
            },
            getStockItemName(index){
                return index+'_stock_item_id';
            },
            getDescriptionName(index){
                return index+'_description';
            },
            getQuantityName(index){
                return index+'_quantity';
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/stock/transfer/'+this.id)
                    .then(response => {
                        this.stockTransferForm.type = response.stock_transfer.type;
                        this.stockTransferForm.upload_token = response.stock_transfer.upload_token;
                        this.module_id = response.stock_transfer.id;
                        this.stockTransferForm.number = response.stock_transfer.number;
                        this.stockTransferForm.date = response.stock_transfer.date;
                        this.stockTransferForm.return_due_date = response.stock_transfer.return_due_date;
                        this.stockTransferForm.description = response.stock_transfer.description;
                        this.stockTransferForm.room_id = response.stock_transfer.room_id;
                        this.selected_room = response.selected_room;
                        this.stockTransferForm.employee_id = response.stock_transfer.employee_id;
                        this.selected_employee = response.selected_employee;
                        this.stockTransferForm.student_id = response.stock_transfer.student_id;
                        this.selected_student = response.selected_student;
                        response.stock_transfer.details.forEach(detail => {
                            this.stockTransferForm.details.push({
                                quantity: detail.quantity,
                                stock_item_id: detail.stock_item_id,
                                selected_stock_item: (detail.stock_item_id) ? {id: detail.stock_item_id, name: detail.item.name} : null,
                                description: detail.description
                            });
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            store(){
                let loader = this.$loading.show();
                this.stockTransferForm.post('/api/stock/transfer')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_room = null;
                        this.selected_student = null;
                        this.selected_employee = null;
                        this.stockTransferForm.details = [];
                        this.clearAttachment = !this.clearAttachment;
                        this.stockTransferForm.upload_token = this.$uuid.v4();
                        this.addRow();
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.stockTransferForm.patch('/api/stock/transfer/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/inventory/stock/transfer');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onRoomSelect(selectedOption){
                this.stockTransferForm.room_id = selectedOption.id;
            },
            onEmployeeSelect(selectedOption){
                this.stockTransferForm.employee_id = selectedOption.id;
            },
            onStudentSelect(selectedOption){
                this.stockTransferForm.student_id = selectedOption.id;
            },
            confirmDelete(index){
                return dialog => this.deleteDetail(index);
            },
            deleteDetail(index){
                this.stockTransferForm.details.splice(index, 1);
            },
            onStockItemSelect(selectedOption, id){
                let index = id.split("_")[0];
                let detail = this.stockTransferForm.details[index];
                detail.stock_item_id = selectedOption.id;
            },
            onStockItemRemove(removedOption, id){
                let index = id.split("_")[0];
                let detail = this.stockTransferForm.details[index];
                detail.stock_item_id = '';
            }
        },
        computed:{
        }
    }
</script>