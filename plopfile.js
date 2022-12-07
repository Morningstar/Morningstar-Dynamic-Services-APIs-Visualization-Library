const data = require('./code-gen-templates/data-helper');

const config = (plop) => {
    plop.setGenerator('Generic', {
        description: 'Add a new empty component',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Please provide component name, default :',
            default: 'GenericComponent',
        }],
        actions: () => {
            data.Temp = [];
            return [{
                type: 'add',
                path: 'src/components/{{dashCase name}}/{{pascalCase name}}.vue',
                templateFile: 'code-gen-templates/generic.hsb',
            },
            {
                type: 'add',
                path: 'src/components/{{dashCase name}}/doc.mdx',
                templateFile: 'code-gen-templates/doc.hsb',
                data,
            },
            {
                type: 'add',
                path: 'src/stories/{{pascalCase name}}.stories.js',
                templateFile: 'code-gen-templates/story.hsb',
                data: {
                    templateData: '{ message: \'Welcome !\' }',
                },
            },
            {
                type: 'add',
                path: 'tests/unit/{{dashCase name}}.spec.js',
                templateFile: 'code-gen-templates/test.hsb',
                data,
            }];
        },
    });

    plop.setGenerator('Test', {
        description: 'Add unit test for a component',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Please provide component name, default :',
            default: 'GenericComponent',
        }],
        actions: () => {
            data.Temp = [];
            return [{
                type: 'add',
                path: 'tests/unit/{{dashCase name}}.spec.js',
                templateFile: 'code-gen-templates/test.hsb',
                data,
            }];
        },
    });

    plop.setGenerator('Table', {
        description: 'Add a new table component',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Please provide component name, default :',
            default: 'TableComponent',
        },
        {
            type: 'input',
            name: 'templateData',
            message: 'Please provide model data, default :',
            default: JSON.stringify(data.templateData),
        }],
        actions: [{
            type: 'add',
            path: 'src/components/{{dashCase name}}/{{pascalCase name}}.vue',
            templateFile: 'code-gen-templates/table.hsb',
            data,
        },
        {
            type: 'add',
            path: 'src/components/{{dashCase name}}/doc.mdx',
            templateFile: 'code-gen-templates/doc.hsb',
            data,
        },
        {
            type: 'add',
            path: 'src/stories/{{pascalCase name}}.stories.js',
            templateFile: 'code-gen-templates/story.hsb',
            data,
        },
        {
            type: 'add',
            path: 'tests/unit/{{dashCase name}}.spec.js',
            templateFile: 'code-gen-templates/test.hsb',
            data,
        }],
    });

    plop.setHelper('wrapCurly', (text, parent) => `{{${parent}.${text}}}`);
    plop.setHelper('titleCase', (text) => {
        let result = text.replace(/([A-Z]{1,})/g, ' $1');
        result = result.charAt(0).toUpperCase() + result.slice(1);
        return result.trim();
    });
    plop.setHelper('parseObject', (text) => JSON.stringify(text));
    plop.setHelper('lowerCase', (text) => text.toLowerCase());
};

module.exports = config;
