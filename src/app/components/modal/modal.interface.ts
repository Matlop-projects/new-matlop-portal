export interface IDialog {
  props: {
      visible: boolean;
      styles?: { [klass: string]: any } | null;
  };
  onHide: (e?: Event) => void;
  onShow: (e?: Event) => void;
}
