const ToastMsgContainer = ({ msg }: { msg: string }) => {
  return (
    <div className="flex items-center">
      <span>✔️</span>
      <span className="mx-4">{msg}</span>
    </div>
  );
};

export { ToastMsgContainer };
