

# 01 | MCP 准备

> 在让 AI 读懂设计稿之前，你需要先搭一座"桥"。这一篇告诉你这座桥是什么、怎么搭、以及你具体要做什么。
>

---

## 为什么需要 MCP？
AI 和设计稿之间隔着一道墙——它看不见你的 Figma 或 Pixso 文件。

MCP（Model Context Protocol）就是那座桥。搭好之后，AI 就能直接读你的设计稿、拉组件数据、生成规范文档。

**简单说：**  
没有 MCP，AI 就看不到你的设计稿。

---

## 你需要选择一种设计工具
这个项目支持两种设计工具：**Figma** 和 **Pixso**。

它们做的是同一件事，只是看你团队用哪个。

**你只需要配置其中一个**，不需要两个都配。

---

## Figma 用户
[Introduction | Developer Docs](https://developers.figma.com/docs/figma-mcp-server/)

<font style="color:#117CEE;">#搞不明白的话把这个链接扔给大模型来配置就行#</font>

### 配置步骤
### <font style="color:rgb(28, 30, 33);">设置远程服务器（推荐）</font>
**<font style="color:rgb(71, 71, 72);">注意：</font>**<font style="color:rgb(71, 71, 72);">只有</font>[<font style="color:rgb(71, 71, 72);">Figma MCP 目录</font>](https://www.figma.com/mcp-catalog/)<font style="color:rgb(71, 71, 72);">中列出的客户端（例如 VS Code、Cursor 或 Claude Code）才能连接到 Figma MCP 服务器。如果您是希望连接新的 MCP 客户端的开发者，可以</font>[<font style="color:rgb(71, 71, 72);">加入等候名单</font>](https://form.asana.com/?k=kBG-ejRQTdY8x_H6a4vM3Q&d=10497086658021)<font style="color:rgb(71, 71, 72);">。</font>

<font style="color:rgb(28, 30, 33);">Figma MCP 服务器通过向从 Figma 设计文件生成代码的 AI 代理提供重要的设计信息和上下文，将 Figma 直接融入到您的工作流程中。</font>

[<font style="color:rgb(85, 81, 255);">MCP服务器是AI代理使用模型上下文协议</font>](https://modelcontextprotocol.io/)<font style="color:rgb(28, 30, 33);">与数据源交互的标准化接口的一部分</font><font style="color:rgb(28, 30, 33);">。</font>

<font style="color:rgb(28, 30, 33);">Figma 的远程 MCP 服务器让您无需安装 Figma 桌面应用程序即可直接连接到 Figma 文件。您可以将实时 UI 捕获到 Figma Design 中，并将设计上下文融入到您的工作流程中，无论您身在何处。</font>

<font style="color:rgb(28, 30, 33);">服务器启用后，您可以：</font>

+ **<font style="color:rgb(28, 30, 33);">写入画布</font>**<font style="color:rgb(28, 30, 33);">：使用受支持的 MCP 客户端直接在 Figma 设计文件中创建和修改原生 Figma 内容。代理程序可以使用您现有的设计系统和文件结构作为上下文来构建和更新框架、组件、变量和自动布局。</font>

**<font style="color:rgb(71, 71, 72);">注：</font>**<font style="color:rgb(71, 71, 72);">我们正在快速改进 Figma 对 AI 代理的支持。这项功能最终将以付费形式提供，但目前在测试阶段免费使用。</font>

+ **<font style="color:rgb(28, 30, 33);">从实时用户界面生成设计</font>**<font style="color:rgb(28, 30, 33);">：使用受支持的 MCP 客户端捕获 Web 应用或网站的实时用户界面，并将其发送到新建或现有的 Figma 文件或剪贴板。（</font>[<font style="color:rgb(85, 81, 255);">仅限部分客户端</font>](https://developers.figma.com/docs/figma-mcp-server/code-to-canvas/)<font style="color:rgb(28, 30, 33);">）</font>
+ **<font style="color:rgb(28, 30, 33);">从选定的图帧生成代码</font>**<font style="color:rgb(28, 30, 33);">：选择一个 Figma 图帧并将其转换为代码。非常适合产品团队构建新流程或迭代应用功能。</font>
+ **<font style="color:rgb(28, 30, 33);">提取设计上下文</font>**<font style="color:rgb(28, 30, 33);">：将变量、组件和布局数据直接导入到您的 IDE 中。这对于设计系统和基于组件的工作流程尤其有用。</font>
+ **<font style="color:rgb(28, 30, 33);">获取 Make 资源</font>**<font style="color:rgb(28, 30, 33);">：</font>[<font style="color:rgb(85, 81, 255);">从 Make 文件中收集代码资源</font>](https://developers.figma.com/docs/figma-mcp-server/bringing-make-context-to-your-agent/)<font style="color:rgb(28, 30, 33);">，并将其作为上下文提供给 LLM。这有助于您从原型过渡到生产应用程序。</font>
+ **<font style="color:rgb(28, 30, 33);">使用 Code Connect 保持设计系统组件的一致性</font>**<font style="color:rgb(28, 30, 33);">：通过重用现有组件，提升输出质量。Code Connect 可确保生成的代码与代码库保持一致。</font>

<font style="color:rgb(28, 30, 33);">要使用此服务器，您需要通过 Figma 的 OAuth 身份验证流程登录。设置完成后，远程服务器可让您轻松访问 Figma 数据并将其与您的工具集成。</font>

### <font style="color:rgb(28, 30, 33);">启用远程 MCP 服务器</font>
<font style="color:rgb(71, 71, 72);">本文档涵盖了我们支持的几种 MCP 客户端的安装步骤。有关支持的 MCP 客户端的安装指南列表，请参阅</font>[<font style="color:rgb(71, 71, 72);">Figma MCP 服务器指南</font>](https://help.figma.com/hc/en-us/articles/32132100833559#h_01K25F7RBRZKCATVJHNXCS6KXW)<font style="color:rgb(71, 71, 72);">。</font>

<font style="color:rgb(28, 30, 33);">请按照以下步骤操作，适用于您的 MCP 客户：</font>

+ [<font style="color:rgb(85, 81, 255);">克劳德·科德</font>](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/#claude-code)
+ [<font style="color:rgb(85, 81, 255);">OpenAI Codex</font>](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/#codex)
+ [<font style="color:rgb(85, 81, 255);">东亚</font>](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/#cursor)
+ [<font style="color:rgb(85, 81, 255);">VS Code</font>](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/#vs-code)

### <font style="color:rgb(28, 30, 33);">Claude code</font>
#### <font style="color:rgb(28, 30, 33);">使用 Figma 的 Claude Code 插件（推荐）：</font>
<font style="color:rgb(28, 30, 33);">在 Claude Code 中设置 Figma MCP 服务器的推荐方法是安装 Figma 插件，该插件包含 MCP 服务器设置以及常用工作流程的代理技能。</font>

<font style="color:rgb(28, 30, 33);">运行以下命令，从 Anthropic 的官方插件市场安装插件。</font>

```bash
claude plugin install figma@claude-plugins-official
```

<font style="color:rgb(28, 30, 33);">了解更多关于 Anthropic 的</font>[<font style="color:rgb(85, 81, 255);">Claude Code 插件</font>](https://claude.com/blog/claude-code-plugins)<font style="color:rgb(28, 30, 33);">和</font>[<font style="color:rgb(85, 81, 255);">Agent Skills 的</font>](https://claude.com/blog/skills)<font style="color:rgb(28, 30, 33);">信息。</font>

#### <font style="color:rgb(28, 30, 33);">Claude代码的手动设置</font>
1. <font style="color:rgb(28, 30, 33);">在终端中运行以下命令，将 Figma MCP 添加到 Claude Code：</font>`<font style="color:rgb(28, 30, 33);">claude mcp add --transport http figma https://mcp.figma.com/mcp</font>`

**<font style="color:rgb(0, 49, 0);">提示：</font>**<font style="color:rgb(0, 49, 0);">要使 Figma MCP 服务器在所有项目中可用，请使用以下</font>`<font style="color:rgb(0, 49, 0);">--scope user</font>`<font style="color:rgb(0, 49, 0);">标志安装它：</font>`<font style="color:rgb(0, 49, 0);">claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp</font>`

<font style="color:rgb(0, 49, 0);">默认情况下，Claude Code 使用本地作用域，因此服务器仅在当前项目中可用。应用用户作用域意味着您无需为每个项目重新安装服务器。</font>

2. <font style="color:rgb(28, 30, 33);">启动一个新的 Claude Code 实例。</font>
3. <font style="color:rgb(28, 30, 33);">输入</font>`<font style="color:rgb(28, 30, 33);">/mcp</font>`<font style="color:rgb(28, 30, 33);">Claude 来管理您的 MCP 服务器，然后选择</font>**<font style="color:rgb(28, 30, 33);">figma</font>**<font style="color:rgb(28, 30, 33);">。</font><font style="color:rgb(28, 30, 33);"> </font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131266889-b8395da9-79c9-4b3e-b34e-2932ff6c3e4c.png)
4. <font style="color:rgb(28, 30, 33);">选择</font>**<font style="color:rgb(28, 30, 33);">“身份验证”</font>**<font style="color:rgb(28, 30, 33);">。</font><font style="color:rgb(28, 30, 33);"> </font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131267065-eaf923e4-5e4b-4a1b-84d8-b79bd2f69205.png)
5. <font style="color:rgb(28, 30, 33);">点击</font>**<font style="color:rgb(28, 30, 33);">“允许访问”</font>**<font style="color:rgb(28, 30, 33);">。</font><font style="color:rgb(28, 30, 33);"> </font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131266136-1e93ce10-c139-4eda-ad5a-88137ea0f11b.png)
6. <font style="color:rgb(28, 30, 33);">回到 Claude 代码中，你应该会看到：</font>`<font style="color:rgb(28, 30, 33);">Authentication successful. Connected to figma</font>`
7. `<font style="color:rgb(28, 30, 33);">/mcp</font>`<font style="color:rgb(28, 30, 33);">使用Claude Code 中的命令</font><font style="color:rgb(28, 30, 33);"> </font><font style="color:rgb(28, 30, 33);">确认您的 MCP 服务器已连接。</font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131265643-af6f4c69-b264-4054-9acf-b39c8e7554ee.png)
8. <font style="color:rgb(28, 30, 33);">开始提示！</font>

### <font style="color:rgb(28, 30, 33);">Codex</font>
#### <font style="color:rgb(28, 30, 33);">使用 Codex 应用（推荐）：</font>
1. [<font style="color:rgb(85, 81, 255);">安装 Codex 应用。</font>](https://developers.openai.com/codex/app/)
2. <font style="color:rgb(28, 30, 33);">在 Codex 应用的左上角，点击</font>**<font style="color:rgb(28, 30, 33);">“插件”</font>**<font style="color:rgb(28, 30, 33);">。</font>
3. <font style="color:rgb(28, 30, 33);">点击</font><font style="color:rgb(28, 30, 33);">Figma 旁边的</font>**<font style="color:rgb(28, 30, 33);">+ 号。</font>**

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131267215-ead82789-2158-4f76-843a-a6f6806f11a2.png)

4. <font style="color:rgb(28, 30, 33);">点击</font>**<font style="color:rgb(28, 30, 33);">“安装 Figma”</font>**<font style="color:rgb(28, 30, 33);">开始安装过程。</font>
5. <font style="color:rgb(28, 30, 33);">完成身份验证流程。点击</font>**<font style="color:rgb(28, 30, 33);">“允许访问</font>**<font style="color:rgb(28, 30, 33);">”进行身份验证，并允许 ChatGPT 访问您的 Figma 帐户。</font>
6. <font style="color:rgb(28, 30, 33);">开始提示 Codex使用</font><font style="color:rgb(28, 30, 33);">Figma MCP 服务器提供的</font>[<font style="color:rgb(85, 81, 255);">工具。</font>](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)

#### <font style="color:rgb(28, 30, 33);">Codex 手动设置：</font>
1. [<font style="color:rgb(85, 81, 255);">安装 Codex CLI。</font>](https://developers.openai.com/codex/cli/)
2. <font style="color:rgb(28, 30, 33);">在终端中运行以下命令：</font>`<font style="color:rgb(28, 30, 33);">codex mcp add figma --url https://mcp.figma.com/mcp</font>`

<font style="color:rgb(28, 30, 33);">出现提示时，请验证服务器身份。</font>

3. <font style="color:rgb(28, 30, 33);">开始提示 Codex使用</font><font style="color:rgb(28, 30, 33);">Figma MCP 服务器提供的</font>[<font style="color:rgb(85, 81, 255);">工具。</font>](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)

### <font style="color:rgb(28, 30, 33);">Cursor</font>
#### <font style="color:rgb(28, 30, 33);">使用 Figma 的 Cursor 插件（推荐）：</font>
<font style="color:rgb(28, 30, 33);">在 Cursor 中设置 Figma MCP 服务器的推荐方法是安装 Figma 插件，该插件包含 MCP 服务器设置以及常见工作流程的代理技能。</font>

<font style="color:rgb(28, 30, 33);">在 Cursor 的代理聊天窗口中输入以下命令来安装插件：</font>

```plain
/add-plugin figma
```

<font style="color:rgb(28, 30, 33);">该插件包含：</font>

+ <font style="color:rgb(28, 30, 33);">Figma MCP 服务器的 MCP 服务器配置</font>
+ <font style="color:rgb(28, 30, 33);">具备实现设计、通过 Code Connect 连接组件以及创建设计系统规则的技能</font>
+ <font style="color:rgb(28, 30, 33);">Figma MCP 服务器资产处理的正确规则</font>

#### <font style="color:rgb(28, 30, 33);">手动设置cursor：</font>
1. <font style="color:rgb(28, 30, 33);">点击</font><font style="color:rgb(85, 81, 255);">Figma MCP 服务器深度链接</font><font style="color:rgb(28, 30, 33);">。这将在 Cursor 中打开 MCP 配置。</font>
2. <font style="color:rgb(28, 30, 33);">单击</font><font style="color:rgb(28, 30, 33);">“安装 MCP 服务器？”下的</font><font style="color:rgb(28, 30, 33);"> </font>**<font style="color:rgb(28, 30, 33);">安装</font>**<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131267588-3eaf17bd-9100-4956-88db-8a6ff61930e2.png)
3. <font style="color:rgb(28, 30, 33);">点击Figma 旁边的</font>**<font style="color:rgb(28, 30, 33);">“连接”</font>**<font style="color:rgb(28, 30, 33);">按钮，开始身份验证过程。</font>
4. <font style="color:rgb(28, 30, 33);">单击</font>**<font style="color:rgb(28, 30, 33);">打开</font>**<font style="color:rgb(28, 30, 33);">。</font><font style="color:rgb(28, 30, 33);"> </font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131268045-2376bcca-e6db-42a3-b7bf-36708b292442.png)
5. **<font style="color:rgb(28, 30, 33);">允许访问</font>**<font style="color:rgb(28, 30, 33);"> </font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131268631-1c9fbc73-f98f-4f88-b165-3204e4b1fd29.png)
6. <font style="color:rgb(28, 30, 33);">开始提示！</font>

### <font style="color:rgb(28, 30, 33);">VS Code</font>
1. <font style="color:rgb(28, 30, 33);">使用快捷键⌘ShiftP，然后：</font>
    - <font style="color:rgb(28, 30, 33);">选择</font>**<font style="color:rgb(28, 30, 33);">MCP：打开用户配置</font>**<font style="color:rgb(28, 30, 33);">，以全局使用 Figma MCP 服务器。</font>
    - <font style="color:rgb(28, 30, 33);">选择</font>**<font style="color:rgb(28, 30, 33);">MCP：打开工作区文件夹 MCP 配置</font>**<font style="color:rgb(28, 30, 33);">，即可在当前工作区内使用 Figma MCP 服务器。</font>

**<font style="color:rgb(71, 71, 72);">注意：</font>**<font style="color:rgb(71, 71, 72);">如果该文件尚不存在，系统会提示您创建该</font>`<font style="color:rgb(71, 71, 72);">mcp.json</font>`<font style="color:rgb(71, 71, 72);">文件。</font>

2. <font style="color:rgb(28, 30, 33);">在</font>`<font style="color:rgb(28, 30, 33);">mcp.json</font>`<font style="color:rgb(28, 30, 33);">文件中粘贴以下代码：</font>

```plain
{
   “输入”：[]，
   服务器：{
     "figma": {
       "url": "https://mcp.figma.com/mcp",
       "type": "http"
     }
   }
 }
```

3. <font style="color:rgb(28, 30, 33);">点击“开始”（位于 MCP 服务器名称上方）。</font><font style="color:rgb(28, 30, 33);"> </font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131268904-34576ee1-b8ec-4d7c-a620-9a59c9489994.png)
4. **<font style="color:rgb(28, 30, 33);">允许访问</font>**<font style="color:rgb(28, 30, 33);">。</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131268960-a985a5f3-fdbd-442c-801f-d2c543e0e5a2.png)

5. <font style="color:rgb(28, 30, 33);">开始提示！</font>

### <font style="color:rgb(28, 30, 33);">使用 MCP 服务器</font>
<font style="color:rgb(28, 30, 33);">MCP 服务器引入了一系列工具，帮助 LLM 将实时 UI 导入 Figma Design，并从 Figma 获取设计上下文。连接成功后，即可开始向 MCP 客户端发出指令。</font>

<font style="color:rgb(28, 30, 33);">有关工具和示例的完整列表，请参阅</font>[<font style="color:rgb(85, 81, 255);">“工具和提示”</font>](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)<font style="color:rgb(28, 30, 33);">。</font>

### <font style="color:rgb(28, 30, 33);">示例：将 UI 发送到 Figma</font>
**<font style="color:rgb(71, 71, 72);">注意：</font>**<font style="color:rgb(71, 71, 72);">目前仅适用于部分 MCP 客户。请参阅</font>[<font style="color:rgb(71, 71, 72);">画布代码</font>](https://developers.figma.com/docs/figma-mcp-server/code-to-canvas/)<font style="color:rgb(71, 71, 72);">。</font>

<font style="color:rgb(28, 30, 33);">将您的 Web 应用程序或网站的实时 UI 发送到 Figma 需要通过与您的 MCP 客户的沟通来完成：</font>

1. <font style="color:rgb(28, 30, 33);">提示您的 MCP 客户：“为我的应用程序启动本地服务器，并将 UI 捕获到新的 Figma 文件中。”</font>
2. <font style="color:rgb(28, 30, 33);">请按照客户提供的步骤操作。您的客户会为您打开一个浏览器窗口，或者提供一个链接供您点击。</font>
3. <font style="color:rgb(28, 30, 33);">使用捕获工具栏捕获 Web 应用程序或网站的页面、元素和状态。</font>
4. <font style="color:rgb(28, 30, 33);">完成后请通知客户。客户会提供一个链接，您可以通过该链接打开创建的 Figma 文件。</font>

### <font style="color:rgb(28, 30, 33);">示例：获取设计背景</font>
<font style="color:rgb(28, 30, 33);">从文件中获取设计上下文和代码是基于链接的。使用方法如下：</font>

1. <font style="color:rgb(28, 30, 33);">复制 Figma 中帧或图层的链接</font>
2. <font style="color:rgb(28, 30, 33);">提示您的客户协助您在选定的网址上实施该设计。</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776131269290-3037f69e-5f01-4dbd-9cad-069c6cb84142.png)

**<font style="color:rgb(71, 71, 72);">注意：</font>**<font style="color:rgb(71, 71, 72);">您的客户端将无法导航到所选 URL，但它将提取 MCP 服务器识别要返回哪个对象信息的节点 ID。</font>

---

## Pixso 用户
[Pixso帮助中心](https://pixso.cn/help/guide/77/1760321270448829?menu=design)

<font style="color:#117CEE;">#搞不明白的话把这篇配置教程扔给大模型就行#</font>

### <font style="color:rgb(60, 60, 67);">第一步：启用客户端 MCP</font>
1. <font style="color:rgb(60, 60, 67);">安装并登录 Pixso 客户端（客户端版本不低于 2.2.0）</font>
2. <font style="color:rgb(60, 60, 67);">在 Pixso 客户端中新建或打开一个设计文件</font>
3. <font style="color:rgb(60, 60, 67);">在设计文件的左上角文件下，找到并启用 Pixso MCP</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776130994659-2dd9b644-c6d8-47fb-b812-9998a1a84b0e.png)

<font style="color:rgb(60, 60, 67);">成功启用 Pixso MCP 后，当前画布的底部会出现 Pixso MCP 已成功启用的提示。</font>

<font style="color:rgb(60, 60, 67);">Pixso MCP 服务器的本地地址为：</font><font style="color:rgb(60, 60, 67);"> </font>[<font style="color:rgb(52, 81, 178);">http://127.0.0.1:3667/mcp</font>](http://127.0.0.1:3667/mcp)

### <font style="color:rgb(60, 60, 67);">第二步：配置</font>
#### <font style="color:rgb(60, 60, 67);">Claude Code (CLI)</font>
<font style="color:rgb(60, 60, 67);">在终端中执行以下命令快速配置：</font>

```plain
claude mcp add --transport http pixso-desktop http://127.0.0.1:3667/mcp
```

#### <font style="color:rgb(60, 60, 67);">Cursor</font>
1. <font style="color:rgb(60, 60, 67);">打开 Cursor -></font><font style="color:rgb(60, 60, 67);"> </font>**<font style="color:rgb(60, 60, 67);">Cursor Settings</font>**<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">-></font><font style="color:rgb(60, 60, 67);"> </font>**<font style="color:rgb(60, 60, 67);">MCP & Integrations</font>**<font style="color:rgb(60, 60, 67);">。</font>
2. <font style="color:rgb(60, 60, 67);">找到 MCP Tools 区域，点击</font><font style="color:rgb(60, 60, 67);"> </font>**<font style="color:rgb(60, 60, 67);">New MCP Server</font>**<font style="color:rgb(60, 60, 67);">。</font>
3. <font style="color:rgb(60, 60, 67);">名称可自定义（如</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">Pixso MCP</font>`<font style="color:rgb(60, 60, 67);">），类型选择</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">sse</font>`<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">或</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">http</font>`<font style="color:rgb(60, 60, 67);">，并将 URL 设置为</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">http://127.0.0.1:3667/mcp</font>`<font style="color:rgb(60, 60, 67);">。</font>
4. <font style="color:rgb(60, 60, 67);">或者直接编辑</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">mcp.json</font>`<font style="color:rgb(60, 60, 67);">，添加如下内容：</font>

```plain
{
  "mcpServers": {
    "Pixso MCP": {
      "url": "http://127.0.0.1:3667/mcp",
      "headers": {}
    }
  }
}
```

5. <font style="color:rgb(60, 60, 67);">保存后，在设置面板点击启动。</font>

#### <font style="color:rgb(60, 60, 67);">Cline 插件 (VS Code 等)</font>
<font style="color:rgb(60, 60, 67);">Cline 是一款流行的 AI 编程插件。要将 Pixso MCP 接入 Cline：</font>

1. <font style="color:rgb(60, 60, 67);">在 Cline 侧边栏的顶部导航中，点击</font><font style="color:rgb(60, 60, 67);"> </font>**<font style="color:rgb(60, 60, 67);">MCP Servers</font>**<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">图标（或在 Configure 标签下点击 "Configure MCP Servers"）。</font>
2. <font style="color:rgb(60, 60, 67);">这将打开</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">cline_mcp_settings.json</font>`<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">文件。</font>
3. <font style="color:rgb(60, 60, 67);">在文件中添加基于 SSE（Server Sent Events）的远程服务器配置：</font>

```plain
{
  "mcpServers": {
    "pixso-mcp": {
      "url": "http://127.0.0.1:3667/mcp",
      "alwaysAllow": [],
      "disabled": false
    }
  }
}
```

4. <font style="color:rgb(60, 60, 67);">保存文件，Cline 会自动连接到 Pixso MCP，连接成功后即可在 Cline 对话中使用。</font>

#### <font style="color:rgb(60, 60, 67);">Trae IDE</font>
<font style="color:rgb(60, 60, 67);">Trae v1.3.0 及以上版本原生支持 MCP。</font>

1. <font style="color:rgb(60, 60, 67);">您可以在项目级配置</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">.trae/mcp.json</font>`<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">或全局配置</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">~/.cursor/mcp.json</font>`<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">(Trae 兼容配置目录)。</font>
2. <font style="color:rgb(60, 60, 67);">在配置文件中添加 SSE 类型的服务：</font>

```plain
{
  "mcpServers": [
    {
      "name": "pixso",
      "url": "http://127.0.0.1:3667/mcp",
      "type": "sse"
    }
  ]
}
```

3. <font style="color:rgb(60, 60, 67);">重启 Trae 或在 MCP 面板中刷新即可连接。</font>

#### <font style="color:rgb(60, 60, 67);">Kiro</font>
<font style="color:rgb(60, 60, 67);">Kiro 也支持通过 MCP 连接外部工具：</font>

1. <font style="color:rgb(60, 60, 67);">打开 Kiro 的配置文件：全局级别的</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">~/.kiro/settings/mcp.json</font>`<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">或工作区级别的</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">.kiro/settings/mcp.json</font>`<font style="color:rgb(60, 60, 67);">。</font>
2. <font style="color:rgb(60, 60, 67);">添加 Pixso 的 MCP 服务配置：</font>

```plain
{
  "mcpServers": {
    "pixso-mcp": {
      "url": "http://127.0.0.1:3667/mcp"
    }
  }
}
```

3. <font style="color:rgb(60, 60, 67);">（可选）如果您不希望频繁被询问是否允许调用 Pixso 工具，可以在配置中加入</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">"autoApprove": ["getCode", "getNodeDSL"]</font>`<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">等参数。保存并重新加载 Kiro 即可。</font>

#### <font style="color:rgb(60, 60, 67);">Windsurf</font>
1. <font style="color:rgb(60, 60, 67);">打开 Windsurf 设置，进入</font><font style="color:rgb(60, 60, 67);"> </font>**<font style="color:rgb(60, 60, 67);">MCP Servers</font>**<font style="color:rgb(60, 60, 67);"> </font><font style="color:rgb(60, 60, 67);">面板，点击</font><font style="color:rgb(60, 60, 67);"> </font>**<font style="color:rgb(60, 60, 67);">Manage MCPs</font>**<font style="color:rgb(60, 60, 67);">。</font>
2. <font style="color:rgb(60, 60, 67);">点击 View raw config 打开</font><font style="color:rgb(60, 60, 67);"> </font>`<font style="color:rgb(52, 81, 178);background-color:rgba(142, 150, 170, 0.14);">mcp_config.json</font>`<font style="color:rgb(60, 60, 67);">。</font>
3. <font style="color:rgb(60, 60, 67);">添加如下内容并保存：</font>

```plain
{
  "mcpServers": {
    "pixso": {
      "serverUrl": "http://127.0.0.1:3667/mcp"
    }
  }
}
```

4. <font style="color:rgb(60, 60, 67);">返回配置页点击刷新，显示绿色状态即连接成功。</font>

### <font style="color:rgb(60, 60, 67);">第三步：在 Agent 客户端中对话</font>
<font style="color:rgb(60, 60, 67);">MCP 客户端与 Pixso MCP 服务器成功连接后，即可在客户端中使用。</font>

<font style="color:rgb(60, 60, 67);">Pixso MCP 支持以下两种方式获取 Pixso 设计稿数据：</font>

### <font style="color:rgb(60, 60, 67);">复制链接</font>
**<font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">注意事项</font>**

<font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">图层的链接不是文件的分享链接，也不是页面的链接</font>

<font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">链接上的 "item-id" 用于帮助 Agent 找到你想要的图层</font>

1. <font style="color:rgb(60, 60, 67);">在 Pixso 客户端中打开设计文件</font>
2. <font style="color:rgb(60, 60, 67);">在设计文件中选中容器，复制容器链接</font>
3. <font style="color:rgb(60, 60, 67);">在客户端 IDE（如 Cursor）中打开对话模式，在对话中粘贴容器链接，并给出相关指令，如：生成 HTML 代码</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776130994934-9eb2f8fe-a4bf-4846-9add-88d20154d3c1.png)

<font style="color:rgb(60, 60, 67);">将链接粘贴到 Agent 对话框中</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/40657008/1776130994798-cdc3c0aa-fcf7-4d7d-9b82-83c5509d9aa6.png)

### <font style="color:rgb(60, 60, 67);">选中容器</font>
1. <font style="color:rgb(60, 60, 67);">在 Pixso 客户端中打开设计文件</font>
2. <font style="color:rgb(60, 60, 67);">在设计文件画布内单选中容器图层</font>
3. <font style="color:rgb(60, 60, 67);">在客户端 IDE（如 Cursor）中打开对话模式，进行对话，如：生成 HTML 代码</font>

**<font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">注意事项：</font>**

<font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">为保证 MCP 服务的正常连接：</font>

1. <font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">请保持 Pixso 客户端始终开启</font>
2. <font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">请保持容器所处的设计文件始终处于激活页签</font>
3. <font style="color:rgb(60, 60, 67);background-color:rgba(142, 150, 170, 0.14);">请使用先进的大模型（如 Claude-4.6-sonnet 等）</font>



### 怎么找到 Node ID？
打开 Pixso 设计文件，选中任意组件，选择右键选择复制链接，你会直接得到：

```plain
https://pixso.cn/app/design/8ZyxsigoAreFS7dkF9hl7A?item-id=16:36612
```

`item-id=16:36612` 就是这个组件的 Node ID。

---

## 设计师在这个环节具体要做什么？
**说实话：不多。**

你只需要做两件事：

**1. 知道你团队用哪个设计工具**  
Figma 还是 Pixso，和同事对齐。如果有管理员，让管理员帮你搭好 MCP。

**2. 会复制链接**  
需要 AI 处理某个组件时，把设计稿链接或 Node ID 给它就行。

剩下的——AI 会自己搞定。

---

## 快速验证
搭好后，怎么知道成功了？

在 AI 工具里让它读取一个组件的设计数据，如果能返回颜色、尺寸、间距等信息，说明 MCP 已经通了。

---

## 环境检查
- [ ] 我知道团队用的是 Figma 还是 Pixso
- [ ] MCP 已经配置好（可以请管理员帮忙）
- [ ] 我知道怎么找到组件的链接或 Node ID
- [ ] 我能打开 `list/MCP-List.md` 查看已收录的组件列表

---

## 参考来源
+ [Figma MCP 官方文档](https://developers.figma.com/docs/figma-mcp-server)
+ [Pixso MCP 官方主页](https://pixso.cn/mcp)
+ [Pixso MCP 教程](https://pixso.cn/community/file/as_U1SjAQzqHUXyhaKfRiw)
