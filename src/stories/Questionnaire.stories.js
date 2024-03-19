import Questionnaire from '@/components/questionnaire/Questionnaire.vue';
import docPage from '@/components/questionnaire/doc.mdx';
import questions from '@/components/questionnaire/questionairre.json';

export default {
    title: 'Components/Questionnaire',
    component: Questionnaire,
    argTypes: {
        showHeader: Boolean,
        questionairre: Object
    },
    parameters: {
        docs: {
            page: docPage,
        },
    },
};

const Template = (args, { argTypes, loaded }) => {
    return {
        props: Object.keys(argTypes),
        components: { Questionnaire },
        template: `<questionnaire :questionairre='questionairre' :showHeader='showHeader' />`
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Questionnaire';
StoryDetails.args = {
    showHeader: true,
    questionairre: questions
};
