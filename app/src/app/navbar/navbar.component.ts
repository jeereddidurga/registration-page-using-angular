import { Component } from '@angular/core';
import { UserService } from '../Services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  fg!:FormGroup;
  records:User[]=[];
  searchbyemail:string='';
  foundRecord:User | null=null;

  constructor(private service:UserService,private fb:FormBuilder){
    
  }
 
  ngOnInit():void{
    this.getalldata();
    this.ininit();

  }

  ininit():void{
    this.fg=this.fb.group({
      id:[null],
      name:['',[Validators.required,Validators.minLength(5),Validators.maxLength(30)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.maxLength(12),Validators.minLength(8)]]
    })
  }

  getalldata():void{
    this.service.onfetch().subscribe((data) => {
      this.records =data;
    })
  }
  postdata():void{
    const posting:User={...this.fg.value,id:this.getting()}
    this.service.onadd(posting).subscribe(() => {
      this.getalldata();
      this.resetForm();
    })
  }
  getting():number{
    return this.records.length > 0? Math.max(...this.records.map((record) => record.id || 0)) + 1:1;
  }
  deleteuser(id:number | undefined):void{
    if(id!==undefined)
    this.service.ondelete(id).subscribe(() => {
      this.getalldata();
    })
  }
  updateuser():void{
    const id=this.fg.value.id;
    const updaterecord:User={...this.fg.value};
    this.service.onupdate(id,updaterecord).subscribe(() => {
      this.getalldata();
    });
  }

  updateForm(record:User | null):void{

    if (record) {
      
      this.fg.patchValue(record);
    }
    else{
      this.resetForm();
    }

  }
  
  searchbyEmail(email:string):void{
    this.service.getbyemail(email).subscribe((data)=>{

      if(data && data.length > 0){
        this.foundRecord = data[0];
         this.updateForm(this.foundRecord);
      }
      else{
        this.foundRecord=null;
        console.log(`user with email : ${email} not found `)
      }
    });
  }

  resetForm():void{
    this.fg.reset();
  }
}
