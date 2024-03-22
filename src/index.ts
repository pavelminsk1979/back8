import {app} from "./settings";
import {port, runDb} from "./db/mongoDb";



const startApp=async ()=>{
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()

