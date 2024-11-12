const Toast = ({ isHidden, isSuccess, message }) => {
    return (
        <div className= {isHidden ? "hidden" : "flex flex-row w-full justify-center"}>
        <div className= {isSuccess ? "fixed bottom-4 bg-secondary-light dark:bg-secondary-dark w-4/5 p-5 rounded-xl border-2 border-slate-500": "fixed bottom-4 bg-warning-light dark:bg-warning-dark w-4/5 p-5 rounded-xl border-2 border-red-500"}>
            <p className="text-center">{message}</p>
        </div>
        </div>
    );
}

export default Toast;