import {writable} from "svelte/store"

export const tool = writable<tools>("move");
export const penprops = writable<penprops>({
  width: 30,
  color: "#000",
  drag: false
});

// ---- DB ----
import * as JsStore from 'jsstore';
import workerInjector from "jsstore/dist/worker_injector";
const connection = new JsStore.Connection();
connection.addPlugin(workerInjector);

// -- Varibles --
export const files = writable<saveRow[]|any[]>();
export const current = writable<saveRow>();

let cr: saveRow; current.subscribe(r => cr = r);

// init db
export async function updateFS(): Promise<saveRow[]> {
  let tfs: saveRow[] = await connection.select({
    from: "Files"
  })

  if (tfs.length == 0) {
    await newCanvas();
    tfs = await connection.select({
      from: "Files"
    })
  } else {
    files.set(tfs);
  }

  let ccv = localStorage.getItem("ccv");
  if (ccv == undefined) current.set(tfs[0]);
  else {
    let crt: saveRow[] = await connection.select({
      from: "Files",
      where: {
        id: parseInt(ccv)
      }
    });
    if (crt.length == 0) current.set(tfs[0]);
    else current.set(crt[0]);
  }

  return tfs;
}

export async function init() {
  let isNew = await connection.initDb({
    name: 'Canvas',
    tables: [{
      name: 'Files',
      columns: {
        id: { autoIncrement: true, primaryKey: true },
        name: { dataType: JsStore.DATA_TYPE.String, notNull: true },
        blocks: { dataType: JsStore.DATA_TYPE.Object, notNull: true },
        createdData: { dataType: JsStore.DATA_TYPE.DateTime, notNull: true },
        lastUpdate: { dataType: JsStore.DATA_TYPE.DateTime, notNull: true }
      }
    }]
  });

  if (isNew) {
    newCanvas();
  };
  await updateFS();
}
init();

export async function saveCanvas(id: number, blocks: Dict<ImageData>) {
  await connection.update({
    in: "Files",
    set: {
      blocks,
    },
    where: {
      id
    }
  });
  files.set(await connection.select({
    from: "Files"
  }));
}

export async function newCanvas(name: string = "New Canvas") {
  await connection.insert({
    into: "Files",
    values: [{
      name,
      blocks: {},
      createdData: new Date(),
      lastUpdate: new Date()
    }]
  });
  files.set(await connection.select({
    from: "Files"
  }));
}

export async function deleteCanvas(id: number) {
  await connection.remove({
    from: "Files",
    where: {
      id
    }
  });
  if (cr.id == id) {
    let rt = await updateFS();
    current.set(rt[0]);
  }
  files.set(await connection.select({
    from: "Files"
  }));
}

export async function dropDB() {
  await connection.dropDb();
  init();
}