import {
  Component, OnInit, TemplateRef, ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Provider } from 'app/models/provider';
import { ProviderService } from 'app/services/provider.service';

import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { Row } from 'ng2-smart-table/lib/lib/data-set/row';

@Component({
  selector: 'provider',
  styleUrls: ['provider.component.scss'],
  templateUrl: './provider.component.html',
})
export class ProviderComponent implements OnInit {
  @ViewChild('ng2TbProvider') ng2TbProvider: Ng2SmartTableComponent;
  @ViewChild('dialogProvider') dialogProvider: TemplateRef<any>;
  @ViewChild('dialogDelete') dialogDelete: TemplateRef<any>;

  dialogRef: NbDialogRef<any>;

  tbProviderData: Provider[];
  tbProviderConfig: Object;
  providerSelected: Provider;

  formProvider = this.formBuilder.group({
    _id: [null],
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    cnpj: [null, Validators.required],
    creation: { value: null, disabled: true },
  });

  constructor(private formBuilder: FormBuilder,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService,
              private providerService: ProviderService) { }

  ngOnInit(): void {
    this.setConfigTbProvider();
    this.setDataTbProvider();
  }

  private setConfigTbProvider() {
    this.tbProviderConfig = {
      mode: 'external',
      actions: { columnTitle: 'Ações', add: false, position: 'right' },
      edit: {
        editButtonContent: '<span class="nb-edit"  title="Editar"></span>',
      },
      delete: {
        deleteButtonContent: '<span class="nb-trash"  title="Excluir"></span>',
      },
      noDataMessage: 'Nenhum fornecedor cadastrado.',
      columns: {
        name: {
          title: 'Nome',
        },
        email: {
          title: 'E-mail',
        },
      },
    };
  }

  private setDataTbProvider() {
    this.providerService.list().subscribe((res) => {
      this.tbProviderData = res.body;
    });
  }

  public openModalProvider(event: Row) {
    this.formProvider.reset();

    if (event) {
      const provider: Provider = event.getData();
      this.providerService.findById(provider._id).subscribe((res) => {
        this.formProvider.patchValue(res.body);
      });
    }

    this.dialogRef = this.dialogService.open(this.dialogProvider);
  }

  public openModalExclusion(event: Row) {
    this.providerSelected = event.getData();
    this.dialogRef = this.dialogService.open(this.dialogDelete, { context: this.providerSelected.name });
  }

  public btnSave() {
    if (this.formProvider.invalid) return this.setFormInvalid();

    if (this.isAdd()) this.addProvider();
    else this.editProvider();
  }

  private setFormInvalid() {
    this.toastrService.warning('Existem um ou mais campos obrigatórios que não foram preenchidos.', 'Atenção');
    this.formProvider.get('name').markAsTouched();
    this.formProvider.get('email').markAsTouched();
    this.formProvider.get('cnpj').markAsTouched();
  }

  private isAdd(): boolean {
    return !this.formProvider.get('_id').value;
  }

  private addProvider() {
    this.providerService.create(this.findFormAdd()).subscribe((res) => {
      this.tbProviderData.push(res.body);
      this.ng2TbProvider.source.refresh();
      this.toastrService.success('Fornecedor criado com sucesso.', 'Sucesso');
      this.dialogRef.close();
    });
  }

  private findFormAdd() {
    const provider = this.formProvider.value;
    delete provider._id;

    return provider;
  }

  private editProvider() {
    this.providerService.edit(this.formProvider.value).subscribe((res) => {
      this.tbProviderData = this.tbProviderData.map((provider: Provider) => {
        if (provider._id === this.formProvider.value._id) return this.formProvider.value;
        return provider;
      });
      this.toastrService.success('Fornecedor editado com sucesso.', 'Sucesso');
      this.dialogRef.close();
    });
  }

  public findOperation(): string {
    return this.isAdd() ? 'Inclusão' : 'Edição';
  }

  public btnDelete() {
    this.providerService.delete(this.providerSelected._id).subscribe((res) => {
      this.tbProviderData = this.tbProviderData.filter(((provider) => provider._id !== this.providerSelected._id));
      this.toastrService.success('Fornecedor excluído com sucesso.', 'Sucesso');
      this.dialogRef.close();
    });
  }
}
