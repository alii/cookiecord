import {
    command,
    Module,
    listener,
    default as CookiecordClient,
    CommonInhibitors
} from "../../src";
import { Message, GuildMember, User, Guild } from "discord.js";
import { inspect } from "util";
import { readFileSync } from "fs";

export default class ExampleModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command({ description: "asd" })
    test(msg: Message, a: string, b: number, u: User, m: GuildMember) {
        msg.reply(a + b + u.tag + m.nickname);
    }

    @command({ description: "abc", aliases: ["gc"] })
    guildcount(msg: Message, offset: number) {
        msg.reply(this.client.guilds.size + offset);
    }

    @listener({ event: "message" })
    onMessage(msg: Message) {
        console.log("onMessage", msg.content);
    }

    @command({ description: "pong" })
    ping(msg: Message) {
        msg.reply("Pong. :ping_pong:");
    }
    @command({
        description: "one big string for all of the args",
        single: true
    })
    single(msg: Message, str: string) {
        msg.reply("You said " + str);
    }
    @command({
        inhibitors: [CommonInhibitors.botAdminsOnly]
    })
    badboy(msg: Message, m: GuildMember) {
        msg.channel.send(`${m} is a bad boy!`);
    }
    @command({})
    todo(msg: Message) {
        msg.reply("```" + readFileSync("../TODO").toString() + "```");
    }
    @command({
        inhibitors: [
            CommonInhibitors.hasGuildPermission("BAN_MEMBERS"),
            CommonInhibitors.userCooldown(1000 * 10)
        ]
    })
    fakeban(msg: Message, m: GuildMember) {
        msg.channel.send(`${m}:hammer:`);
    }
    @command({
        onError: msg => {
            msg.reply("custom error reply!");
        }
    })
    triggerError(msg: Message) {
        throw new Error("triggered dat error!");
    }
    // This command is very stupid and should not exist anywhere near production!!!!!!!!!!
    // @command({ description: "eval some js", single: true })
    // async eval(msg: Message, js: string) {
    //         try {
    //             let result = eval(js);
    //             if (result instanceof Promise) result = await result;
    //             if (typeof result != `string`)
    //                 result = inspect(result);
    //             if (result.length > 1990)
    //                 return await msg.channel.send(
    //                     `Message is over the discord message limit.`
    //                 );
    //             await msg.channel.send(
    //                 "```js\n" +
    //                     result.split(this.client.token).join("[TOKEN]") +
    //                     "\n```"
    //             );
    //         } catch (error) {
    //             msg.reply(
    //                 "error! " + error.split(this.client.token).join("[TOKEN]")
    //             );
    //         }
    // }
}