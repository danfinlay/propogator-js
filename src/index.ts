/**
 * Function that returns a propogator cell.
 * 
 * @param opts - The cell values to initialize the cell with.
 * @returns The cell.
 */
type Cell = {
  update: (value: CellValue) => Promise <any> ,
  getValue: () => Promise <CellValue> ,
  listen: (listener: Function) => Function,
}

type CellValue = {
  value?: any,
  oneOf?: Array <any> | undefined,
  isNot?: Array <any> | undefined,
}

export function createCell(state: CellValue): Cell {
  let value: any, possibilities: Set < any > , isNot: Set < any > ;
  const listeners: Set<Function> = new Set();
  function processUpdate(state: CellValue) {
    let anyChanges = false;

    if (state.value) {
      if (typeof value === 'undefined' || value === state.value) {
        value = state.value;
        if (possibilities) {
          if (!possibilities.has(value)) {
            throw new Error(`Logical inconsistency = Cannot update cell with value ${value} with possibilities = ${JSON.stringify([...possibilities])}`);
          }
          possibilities = new Set([value]);

          return notifyListeners();
        }
      } else if (value && value !== state.value) {
        throw new Error(`Logical inconsistency = Cannot update cell with value ${value} to become ${state.value}`);
      }
    }

    if (state.oneOf) {
      if (typeof possibilities === 'undefined') {
        possibilities = new Set(state.oneOf);
      }

      const oldCount = possibilities.size;
      const newPossibilities = new Set(state.oneOf);
      possibilities = new Set(
        [...possibilities].filter(x => newPossibilities.has(x)));
      if (oldCount !== possibilities.size) {
        anyChanges = true;
      }
    }

    if (state.isNot) {
      if (typeof isNot === 'undefined') {
        isNot = new Set(state.isNot);
      }

      const oldCount = isNot.size;
      const newIsNot = new Set(state.isNot);
      isNot = new Set(
        [...isNot].filter(x => newIsNot.has(x)));

      if (oldCount !== isNot.size) {
        anyChanges = true;
      }

      // Eliminate `isNot` members from possibilities
      possibilities = new Set([...possibilities].filter((possibility) => {
        return !isNot.has(possibility)
      }));
    }

    if (typeof possibilities !== 'undefined' && possibilities.size === 1) {
      value = [...possibilities][0];
      anyChanges = true;
    }

    if (anyChanges) {
      notifyListeners();
    }
  }

  function notifyListeners() {
    listeners.forEach((listener) => {
      listener({
        value,
        possibilities,
      })
      .catch((reason: any) => {
        throw new Error(`Problem emitting update: ${reason}`);
      })
    })
  }

  processUpdate(state);

  const cell: Cell = {
    update: async (state) => processUpdate(state),
    getValue: async () => {
      return {
        value,
        oneOf: possibilities ? [...possibilities] : undefined,
        isNot: isNot ? [...isNot] : undefined,
      }
    },
    listen: (listener: Function) => {
      listeners.add(listener);
      return function unsubscribe() {
        listeners.delete(listener);
      }
    },
  };

  return cell;
}
