const basePriceBySize: Record<"small" | "large", number> = {
    small: 10,
    large: 25,
};

const toppingPriceByName: Record<"chocolate" | "caramel" | "berry", number> = {
    chocolate: 5,
    caramel: 6,
    berry: 10,
};

type NodeRuntime = {
    versions?: { node?: string };
    stdin?: unknown;
    stdout?: unknown;
};

type ReadlinePromises = {
    createInterface: (options: { input: unknown; output: unknown }) => {
        question: (prompt: string) => Promise<string>;
        close: () => void;
    };
};

function showMessage(message: string): void {
    console.log(message);

    if (typeof globalThis.alert === "function") {
        globalThis.alert(message);
    }
}

async function readInput(message: string): Promise<string> {
    if (typeof globalThis.prompt === "function") {
        return globalThis.prompt(message)?.trim() ?? "";
    }

    const runtime = (globalThis as typeof globalThis & { process?: NodeRuntime }).process;
    if (runtime?.versions?.node && runtime.stdin && runtime.stdout) {
        const dynamicImport = new Function("specifier", "return import(specifier)") as
            (specifier: string) => Promise<ReadlinePromises>;
        const readline = await dynamicImport("node:readline/promises");
        const rl = readline.createInterface({ input: runtime.stdin, output: runtime.stdout });
        try {
            return (await rl.question(message + " ")).trim();
        } finally {
            rl.close();
        }
    }

    throw new Error("This environment does not support user input.");
}

async function calculateTotalPrice(): Promise<void> {
    const size = (await readInput("Enter the size of the ice cream (small, large):")).trim().toLowerCase();

    let totalPrice = 0;

    if (size === "small" || size === "large") {
        totalPrice += basePriceBySize[size];
    } else {
        showMessage("Invalid size entered. Please enter 'small' or 'large'.");
        return;
    }

    const toppingsInput = await readInput(
        "Enter the toppings (comma-separated):\nchoices: chocolate (+5), caramel (+6), berry (+10)"
    );

    const toppingsArray = toppingsInput
        .split(",")
        .map((topping) => topping.trim().toLowerCase())
        .filter((topping) => topping.length > 0);

    for (const topping of toppingsArray) {
        if (topping === "chocolate" || topping === "caramel" || topping === "berry") {
            totalPrice += toppingPriceByName[topping];
        } else {
            showMessage(`Unknown topping: ${topping}. It was not added.`);
        }
    }

    const marshmallow = (await readInput("Do you want to add marshmallow? (+5) (yes/no):")).trim().toLowerCase();
    if (marshmallow === "yes" || marshmallow === "y") {
        totalPrice += 5;
    }

    const message = `Total Price: $${totalPrice}`;
    showMessage(message);
}

void calculateTotalPrice();
