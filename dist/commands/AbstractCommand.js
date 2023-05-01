class Command {
    constructor(name, description, args, options) {
        this.name = name;
        this.description = description;
        this.args = args;
        this.options = options;
    }
    async action() {
        throw new Error("An action must be implemented for a command");
    }
}
export default Command;
